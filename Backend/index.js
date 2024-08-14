import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();
import pg from "pg";
import cors from "cors";

const app = express();
const port = 4000;
const frontend_url = "http://localhost:5173";
const stripe = Stripe(process.env.stripe);

app.use(express.json());
app.use(cors());

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

app.post("/api/mentors-register", async (req, res) => {
  const { name, email, phone_number, company_name, expertise_area } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO mentors (name, email, phone_number, company_name, expertise_area)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, email, phone_number, company_name, expertise_area]
    );
    const mentorId = result.rows[0].id;
    res.json({ Mentor_ID: mentorId });
  } catch (error) {
    console.error("Error inserting mentor data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/students-register", async (req, res) => {
  const { name, email, phone_number, college_name, area_of_interest } =
    req.body;

  try {
    const result = await db.query(
      "INSERT INTO students (name, email, phone_number, college_name, area_of_interest) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [name, email, phone_number, college_name, area_of_interest]
    );

    const newStudentId = result.rows[0].id;
    res.json({ Student_ID: newStudentId });
  } catch (error) {
    console.error("Error inserting student data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/all-students", async (req, res) => {
  try {
    const students = await db.query("SELECT * FROM students");
    res.json(students.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

app.get("/api/all-mentors", async (req, res) => {
  try {
    const mentors = await db.query("SELECT * FROM mentors");
    res.json(mentors.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching mentors" });
  }
});

app.get("/api/find-mentor", async (req, res) => {
  const { area_of_interest } = req.query;
  try {
    const result = await db.query(
      "SELECT * FROM mentors WHERE expertise_area = $1 ORDER BY RANDOM() LIMIT 1",
      [area_of_interest]
    );
    if (result.rows.length === 0) {
      return res.json({ message: "error" });
    }
    const mentor = result.rows[0];
    res.json({ mentor });
  } catch (error) {
    console.error("Error finding mentor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/custom-mentors", async (req, res) => {
  const { area_of_interest } = req.query;
  try {
    const result = await db.query(
      "SELECT * FROM mentors WHERE expertise_area = $1",
      [area_of_interest]
    );
    if (result.rows.length === 0) {
      return res.json({ message: "error" });
    }
    console.log(result);

    const mentor = result.rows;
    res.json({ mentor });
  } catch (error) {
    console.error("Error finding mentor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/mentorship/finish", async (req, res) => {
  try {
    const {
      studentId,
      mentorId,
      duration,
      price,
      areaOfInterest,
      startTiming,
    } = req.body;

    console.log("Received request with:", {
      studentId,
      mentorId,
      duration,
      price,
      areaOfInterest,
      startTiming,
    });

    // Retrieve the last session start time for the mentor
    const lastSession = await db.query(
      "SELECT start_time FROM mentorship_sessions WHERE mentor_id = $1 ORDER BY start_time DESC LIMIT 1",
      [mentorId]
    );

    let newStartTime;

    if (lastSession.rows.length === 0) {
      // No previous sessions, default to 6 PM today
      newStartTime = new Date();
      newStartTime.setHours(18, 0, 0, 0);
    } else {
      // Increment the last session start time by 60 minutes
      newStartTime = new Date(lastSession.rows[0].start_time);
      let hours = newStartTime.getHours();
      let minutes = newStartTime.getMinutes();
      minutes += 60;
      if (minutes >= 60) {
        hours += 1;
        minutes -= 60;
      }
      if (hours >= 24) {
        hours -= 24;
        newStartTime.setDate(newStartTime.getDate() + 1);
      }
      newStartTime.setHours(hours, minutes, 0, 0);
    }

    console.log("Calculated new start time before considering startTiming:", newStartTime);

    if (startTiming && new Date(startTiming) > newStartTime) {
      newStartTime = new Date(startTiming);
    }

    console.log("Final new start time:", newStartTime);

    // Insert the new mentorship session into the database
    const response = await db.query(
      "INSERT INTO mentorship_sessions (student_id, mentor_id, duration, price, area_of_interest, status, date, payment, start_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING session_id",
      [
        studentId,
        mentorId,
        duration,
        price,
        areaOfInterest,
        "Pending Payment",
        new Date().toISOString().split('T')[0],  // changed to store only the date
        false,
        newStartTime.toTimeString().slice(0, 5),  // changed to store time in 24-hour format
      ]
    );

    const sessionId = response.rows[0].session_id;

    const line_items = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: `Mentorship Session - ${areaOfInterest}`,
            description: `Mentorship session with a duration of ${duration} minutes, starting at ${newStartTime.toLocaleTimeString()}`,
          },
          unit_amount: price * 100, 
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/mentorship/confirm?success=true&sessionID=${sessionId}`,
      cancel_url: `${frontend_url}/mentorship/confirm?success=false&sessionID=${sessionId}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error finishing mentorship session:", error);
    res
      .status(500)
      .json({ success: false, message: "Error processing payment" });
  }
});

app.post("/api/mentorship/confirm", async (req, res) => {
  try {
    const { sessionID, success } = req.body;
    if (success) {
      await db.query(
        "UPDATE mentorship_sessions SET payment=$1, status=$2 WHERE session_id=$3",
        [true, "payment done", sessionID]
      );
      res.json({ success: true, message: "Payment successful" });
    } else {
      await db.query("DELETE FROM mentorship_sessions WHERE session_id=$1", [
        sessionID,
      ]);
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/api/mentorship/sessions/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await db.query(
      `SELECT 
           ms.session_id,
           ms.student_id,
           ms.mentor_id,
           ms.duration,
           ms.price,
           ms.area_of_interest,
           ms.status,
           ms.date,
           ms.payment,
           s.name AS student_name,
           m.name AS mentor_name
         FROM mentorship_sessions ms
         JOIN students s ON ms.student_id = s.id
         JOIN mentors m ON ms.mentor_id = m.id
         WHERE ms.student_id = $1
         ORDER BY ms.date DESC`,
      [studentId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No sessions found for this student." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "An unexpected error occurred while fetching session data." });
  }
});


app.get("/api/mentorship/session-details", async (req, res) => {
  try {
    const { sessionID } = req.query;
    const response = await db.query(
      "SELECT * FROM mentorship_sessions WHERE session_id = $1",
      [sessionID]
    );

    if (response.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    res.json(response.rows[0]);
  } catch (error) {
    console.error("Error fetching session details:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
