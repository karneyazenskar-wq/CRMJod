// // // server.js
// // require('dotenv').config();
// // const express = require('express');
// // const mysql = require('mysql2/promise');
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');
// // const nodemailer = require('nodemailer');
// // const cors = require('cors');

// // const app = express();
// // app.use(cors());
// // // FIX: default body-parser limit is 100kb — a base64 face-check-in photo blows past
// // // that instantly, causing PayloadTooLargeError. Bumped to 10mb.
// // app.use(express.json({ limit: '10mb' }));
// // app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // // ---------------------------------------------------------------------------
// // // MySQL pool
// // // ---------------------------------------------------------------------------
// // const pool = mysql.createPool({
// //   host: process.env.DB_HOST,
// //   user: process.env.DB_USER,
// //   password: process.env.DB_PASS,
// //   database: process.env.DB_NAME,
// //   waitForConnections: true,
// //   connectionLimit: 10,
// // });

// // // ---------------------------------------------------------------------------
// // // Mailer (Gmail + App Password)
// // // ---------------------------------------------------------------------------
// // const transporter = nodemailer.createTransport({
// //   service: 'gmail',
// //   auth: {
// //     user: process.env.MAIL_USER,
// //     pass: process.env.MAIL_PASS,
// //   },
// // });

// // async function sendCredentialsMail({ toEmail, toName, username, password, role }) {
// //   const mailOptions = {
// //     from: `"JOD Tech CRM" <${process.env.MAIL_USER}>`,
// //     to: toEmail,
// //     subject: 'Welcome to JOD Tech CRM — Your Login Credentials',
// //     html: `
// //       <div style="margin:0; padding:0; background-color:#F1F5F4; font-family: Arial, Helvetica, sans-serif;">
// //         <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F1F5F4; padding: 32px 0;">
// //           <tr>
// //             <td align="center">
// //               <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 10px rgba(3,46,40,0.08);">

// //                 <!-- Header with logo -->
// //                 <tr>
// //                   <td style="background-color:#09685A; padding: 28px 32px; text-align: center;">
// //                     <img src="https://www.jodtech.in/assets/jod-CjP44g3I.jpeg" alt="JOD Tech" width="140" style="display:block; margin: 0 auto;" />
// //                   </td>
// //                 </tr>

// //                 <!-- Body -->
// //                 <tr>
// //                   <td style="padding: 32px;">
// //                     <h2 style="margin:0 0 8px; color:#032E28; font-size: 20px;">Welcome, ${toName}!</h2>
// //                     <p style="margin:0 0 24px; color:#5B6B68; font-size: 14px; line-height: 1.6;">
// //                       Your employee account has been created on <strong>JOD Tech CRM</strong>. Use the credentials below to log in.
// //                     </p>

// //                     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #E4ECEA; border-radius: 10px; overflow: hidden;">
// //                       <tr style="background-color:#F7FAF9;">
// //                         <td style="padding: 12px 16px; font-size: 12px; color:#5B6B68; font-weight: 600; width: 40%;">USERNAME</td>
// //                         <td style="padding: 12px 16px; font-size: 14px; color:#032E28; font-weight: 700;">${username}</td>
// //                       </tr>
// //                       <tr style="border-top: 1px solid #E4ECEA;">
// //                         <td style="padding: 12px 16px; font-size: 12px; color:#5B6B68; font-weight: 600;">PASSWORD</td>
// //                         <td style="padding: 12px 16px; font-size: 14px; color:#032E28; font-weight: 700;">${password}</td>
// //                       </tr>
// //                       <tr style="border-top: 1px solid #E4ECEA; background-color:#F7FAF9;">
// //                         <td style="padding: 12px 16px; font-size: 12px; color:#5B6B68; font-weight: 600;">ROLE</td>
// //                         <td style="padding: 12px 16px; font-size: 14px; color:#032E28; font-weight: 700;">${role}</td>
// //                       </tr>
// //                     </table>

// //                     <div style="margin-top: 24px; padding: 14px 16px; background-color:#FFF7ED; border-left: 3px solid #E0A324; border-radius: 6px;">
// //                       <p style="margin:0; font-size: 12.5px; color:#7A5A17; line-height: 1.5;">
// //                         For security, please change your password immediately after your first login. Do not share these credentials with anyone.
// //                       </p>
// //                     </div>
// //                   </td>
// //                 </tr>

// //                 <!-- Footer -->
// //                 <tr>
// //                   <td style="padding: 20px 32px; background-color:#F7FAF9; border-top: 1px solid #E4ECEA; text-align: center;">
// //                     <p style="margin:0; font-size: 11.5px; color:#9AA7A4;">
// //                       &copy; ${new Date().getFullYear()} JOD Tech CRM. All rights reserved.
// //                     </p>
// //                   </td>
// //                 </tr>

// //               </table>
// //             </td>
// //           </tr>
// //         </table>
// //       </div>
// //     `,
// //   };
// //   return transporter.sendMail(mailOptions);
// // }

// // // ---------------------------------------------------------------------------
// // // JWT middleware
// // // ---------------------------------------------------------------------------
// // function verifyToken(req, res, next) {
// //   const authHeader = req.headers.authorization;
// //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //     return res.status(401).json({ message: 'No token provided.', code: 'NO_TOKEN' });
// //   }
// //   const token = authHeader.split(' ')[1];
// //   try {
// //     req.user = jwt.verify(token, process.env.JWT_SECRET);
// //     next();
// //   } catch (err) {
// //     const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID';
// //     return res.status(401).json({ message: 'Invalid or expired token.', code });
// //   }
// // }

// // // ---------------------------------------------------------------------------
// // // Helper: generate next username based on role
// // // TL0001 for MD (Team Lead), EMP0001... for everyone else
// // // ---------------------------------------------------------------------------
// // async function generateUsername(role) {
// //   const prefix = role === 'MD' ? 'TL' : 'EMP';

// //   const [rows] = await pool.query(
// //     `SELECT username FROM employees WHERE username LIKE ? ORDER BY id DESC LIMIT 1`,
// //     [`${prefix}%`]
// //   );

// //   let nextNumber = 1;
// //   if (rows.length > 0) {
// //     const lastUsername = rows[0].username; // e.g. EMP0007
// //     const lastNumber = parseInt(lastUsername.replace(prefix, ''), 10);
// //     nextNumber = lastNumber + 1;
// //   }

// //   return `${prefix}${String(nextNumber).padStart(4, '0')}`;
// // }

// // // ---------------------------------------------------------------------------
// // // GET all employees
// // // ---------------------------------------------------------------------------
// // app.get('/employees', verifyToken, async (req, res) => {
// //   try {
// //     const [rows] = await pool.query(
// //       `SELECT id, username, name, email, role, specialization, created_at FROM employees ORDER BY id DESC`
// //     );
// //     res.json({ employees: rows });
// //   } catch (err) {
// //     console.log('Fetch employees error:', err);
// //     res.status(500).json({ message: 'Could not fetch employees.' });
// //   }
// // });

// // // ---------------------------------------------------------------------------
// // // POST create employee (auto-generates username, hashes password, emails it)
// // // ---------------------------------------------------------------------------
// // app.post('/employees', verifyToken, async (req, res) => {
// //   const { name, email, password, role, specialization } = req.body;

// //   if (!name || !email || !password) {
// //     return res.status(400).json({ message: 'Name, email and password are required.' });
// //   }

// //   try {
// //     const [existing] = await pool.query(`SELECT id FROM employees WHERE email = ?`, [email]);
// //     if (existing.length > 0) {
// //       return res.status(409).json({ message: 'An account with this email already exists.' });
// //     }

// //     const username = await generateUsername(role || 'Employee');
// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     const [result] = await pool.query(
// //       `INSERT INTO employees (username, name, email, password, role, specialization) VALUES (?, ?, ?, ?, ?, ?)`,
// //       [username, name, email, hashedPassword, role || 'Employee', specialization || null]
// //     );

// //     // Send plain password in mail BEFORE it's lost — hashed version stays in DB only
// //     try {
// //       await sendCredentialsMail({
// //         toEmail: email,
// //         toName: name,
// //         username,
// //         password, // plain text, only used here for the email
// //         role: role || 'Employee',
// //       });
// //     } catch (mailErr) {
// //       console.log('Mail send failed:', mailErr.message);
// //       // Don't fail the whole request just because mail failed —
// //       // account is already created, so let the frontend know via response.
// //     }

// //     res.status(201).json({
// //       message: 'Employee account created.',
// //       employee: { id: result.insertId, username, name, email, role, specialization },
// //     });
// //   } catch (err) {
// //     console.log('Create employee error:', err);
// //     res.status(500).json({ message: 'Could not create employee account.' });
// //   }
// // });

// // // ---------------------------------------------------------------------------
// // // PUT update employee (password optional — only updates if provided)
// // // ---------------------------------------------------------------------------
// // app.put('/employees/:id', verifyToken, async (req, res) => {
// //   const { id } = req.params;
// //   const { name, email, password, role, specialization } = req.body;

// //   try {
// //     if (password) {
// //       const hashedPassword = await bcrypt.hash(password, 10);
// //       await pool.query(
// //         `UPDATE employees SET name=?, email=?, password=?, role=?, specialization=? WHERE id=?`,
// //         [name, email, hashedPassword, role, specialization || null, id]
// //       );

// //       const [userRow] = await pool.query(`SELECT username FROM employees WHERE id=?`, [id]);
// //       const username = userRow[0]?.username;

// //       try {
// //         await sendCredentialsMail({ toEmail: email, toName: name, username, password, role });
// //       } catch (mailErr) {
// //         console.log('Mail send failed:', mailErr.message);
// //       }
// //     } else {
// //       await pool.query(
// //         `UPDATE employees SET name=?, email=?, role=?, specialization=? WHERE id=?`,
// //         [name, email, role, specialization || null, id]
// //       );
// //     }

// //     res.json({ message: 'Employee updated.' });
// //   } catch (err) {
// //     console.log('Update employee error:', err);
// //     res.status(500).json({ message: 'Could not update employee.' });
// //   }
// // });

// // // ---------------------------------------------------------------------------
// // // DELETE employee
// // // ---------------------------------------------------------------------------
// // app.delete('/employees/:id', verifyToken, async (req, res) => {
// //   try {
// //     await pool.query(`DELETE FROM employees WHERE id=?`, [req.params.id]);
// //     res.json({ message: 'Employee deleted.' });
// //   } catch (err) {
// //     console.log('Delete employee error:', err);
// //     res.status(500).json({ message: 'Could not delete employee.' });
// //   }
// // });

// // // ---------------------------------------------------------------------------
// // // (Keep your existing login / other routes below this line, if any)
// // // ---------------------------------------------------------------------------


// // // ---------------------------------------------------------------------------
// // // POST /admin/login — issues a real JWT so protected routes work
// // // ---------------------------------------------------------------------------
// // app.post('/admin/login', async (req, res) => {
// //   const { email, password } = req.body;
// //   const ADMIN_EMAIL = 'admin@jodtech.com';
// //   const ADMIN_PASSWORD = 'admin123';

// //   if (!email || !password) {
// //     return res.status(400).json({ message: 'Email and password are required.' });
// //   }
// //   if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
// //     return res.status(401).json({ message: 'Invalid email or password.' });
// //   }

// //   // 👇 look up (or auto-create) a matching employees row so this account
// //   // has a real employee_id — needed for work_updates, tasks, followups etc.
// //   let [rows] = await pool.query(`SELECT id, role FROM employees WHERE email = ?`, [ADMIN_EMAIL]);
// //   let employeeId = rows[0]?.id;

// //   if (!employeeId) {
// //     const username = await generateUsername('MD');
// //     const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
// //     const [result] = await pool.query(
// //       `INSERT INTO employees (username, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
// //       [username, 'Admin', ADMIN_EMAIL, hashedPassword, 'MD']
// //     );
// //     employeeId = result.insertId;
// //   }

// //   const token = jwt.sign(
// //     { id: employeeId, role: 'admin', email: ADMIN_EMAIL }, // 👈 id added
// //     process.env.JWT_SECRET,
// //     { expiresIn: '7d' }
// //   );

// //   res.json({ token });
// // });

// // // ---------------------------------------------------------------------------
// // // FOLLOW-UPS
// // // ---------------------------------------------------------------------------
// // app.get('/followups', verifyToken, async (req, res) => {
// //   try {
// //     const [rows] = await pool.query(
// //       `SELECT id, client_name, interaction_type, follow_up_date, time_slot, status, notes, created_at
// //        FROM followups ORDER BY follow_up_date DESC, id DESC`
// //     );
// //     res.json({ followups: rows });
// //   } catch (err) {
// //     console.log('Fetch followups error:', err);
// //     res.status(500).json({ message: 'Could not fetch follow-ups.' });
// //   }
// // });

// // app.post('/followups', verifyToken, async (req, res) => {
// //   const { client_name, interaction_type, follow_up_date, time_slot, status, notes } = req.body;

// //   if (!client_name || !follow_up_date || !notes) {
// //     return res.status(400).json({ message: 'Client name, follow-up date and notes are required.' });
// //   }

// //   try {
// //     const [result] = await pool.query(
// //       `INSERT INTO followups (client_name, interaction_type, follow_up_date, time_slot, status, notes, created_by)
// //        VALUES (?, ?, ?, ?, ?, ?, ?)`,
// //       [client_name, interaction_type || 'Call Notes', follow_up_date, time_slot || null, status || 'Scheduled', notes, req.user?.id || null]
// //     );
// //     res.status(201).json({ message: 'Follow-up scheduled.', id: result.insertId });
// //   } catch (err) {
// //     console.log('Create followup error:', err);
// //     res.status(500).json({ message: 'Could not schedule follow-up.' });
// //   }
// // });

// // // ---------------------------------------------------------------------------
// // // TASKS
// // // ---------------------------------------------------------------------------
// // app.get('/tasks', verifyToken, async (req, res) => {
// //   try {
// //     const [rows] = await pool.query(
// //       `SELECT t.id, t.title, t.description AS subtitle, t.priority, t.status, t.due_date, t.notes,
// //               t.assigned_to, ae.name AS assigned_to_name,
// //               t.assigned_by, ab.name AS assigned_by_name,
// //               t.created_at
// //        FROM tasks t
// //        LEFT JOIN employees ae ON ae.id = t.assigned_to
// //        LEFT JOIN employees ab ON ab.id = t.assigned_by
// //        ORDER BY t.id DESC`
// //     );
// //     res.json({ tasks: rows });
// //   } catch (err) {
// //     console.log('Fetch tasks error:', err);
// //     res.status(500).json({ message: 'Could not fetch tasks.' });
// //   }
// // });

// // app.post('/tasks', verifyToken, async (req, res) => {
// //   const { title, description, assigned_to, priority, status, due_date, notes } = req.body;

// //   if (!title || !assigned_to) {
// //     return res.status(400).json({ message: 'Task title and assignee are required.' });
// //   }

// //   try {
// //     const [result] = await pool.query(
// //       `INSERT INTO tasks (title, description, assigned_to, assigned_by, priority, status, due_date, notes)
// //        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
// //       [title, description || null, assigned_to, req.user?.id || null, priority || 'Medium', status || 'todo', due_date || null, notes || null]
// //     );
// //     res.status(201).json({ message: 'Task assigned.', id: result.insertId });
// //   } catch (err) {
// //     console.log('Create task error:', err);
// //     res.status(500).json({ message: 'Could not assign task.' });
// //   }
// // });

// // // ---------------------------------------------------------------------------
// // // WORK UPDATES
// // // ---------------------------------------------------------------------------

// // // Logged-in user's own update for a given date
// // app.get('/work-updates/mine', verifyToken, async (req, res) => {
// //   const { date } = req.query;
// //   if (!date) return res.status(400).json({ message: 'date query param is required.' });

// //   try {
// //     const [rows] = await pool.query(
// //       `SELECT morning, afternoon, evening FROM work_updates WHERE employee_id = ? AND update_date = ?`,
// //       [req.user.id, date]
// //     );
// //     res.json({ update: rows[0] || { morning: '', afternoon: '', evening: '' } });
// //   } catch (err) {
// //     console.log('Fetch my work update error:', err);
// //     res.status(500).json({ message: 'Could not fetch your update.' });
// //   }
// // });

// // // Create/update today's (or selected date's) update — upsert
// // app.post('/work-updates', verifyToken, async (req, res) => {
// //   const { date, morning, afternoon, evening } = req.body;
// //   if (!date) return res.status(400).json({ message: 'date is required.' });

// //   try {
// //     await pool.query(
// //       `INSERT INTO work_updates (employee_id, update_date, morning, afternoon, evening)
// //        VALUES (?, ?, ?, ?, ?)
// //        ON DUPLICATE KEY UPDATE morning = VALUES(morning), afternoon = VALUES(afternoon), evening = VALUES(evening)`,
// //       [req.user.id, date, morning || '', afternoon || '', evening || '']
// //     );
// //     res.json({ message: 'Work update saved.' });
// //   } catch (err) {
// //     console.log('Save work update error:', err);
// //     res.status(500).json({ message: 'Could not save your update.' });
// //   }
// // });

// // // Team-wide view for a given date — every employee + their submission status
// // app.get('/work-updates/team', verifyToken, async (req, res) => {
// //   const { date } = req.query;
// //   if (!date) return res.status(400).json({ message: 'date query param is required.' });

// //   try {
// //     const [rows] = await pool.query(
// //       `SELECT e.id, e.name, e.role, e.email,
// //               w.morning, w.afternoon, w.evening,
// //               CASE WHEN w.id IS NOT NULL AND (w.morning != '' OR w.afternoon != '' OR w.evening != '')
// //                    THEN 'Submitted' ELSE 'Not Submitted' END AS status
// //        FROM employees e
// //        LEFT JOIN work_updates w ON w.employee_id = e.id AND w.update_date = ?
// //        ORDER BY e.name ASC`,
// //       [date]
// //     );
// //     res.json({ employees: rows });
// //   } catch (err) {
// //     console.log('Fetch team updates error:', err);
// //     res.status(500).json({ message: 'Could not load team updates.' });
// //   }
// // });

// // // ---------------------------------------------------------------------------
// // // ATTENDANCE LOGS
// // // ---------------------------------------------------------------------------
// // app.get('/attendance', verifyToken, async (req, res) => {
// //   try {
// //     const [rows] = await pool.query(
// //       `SELECT id, employee_name AS employee, log_date AS date, check_in AS checkIn,
// //               check_out AS checkOut, type, status
// //        FROM attendance_logs ORDER BY log_date DESC, id DESC`
// //     );
// //     res.json({ logs: rows });
// //   } catch (err) {
// //     console.log('Fetch attendance error:', err);
// //     res.status(500).json({ message: 'Could not fetch attendance logs.' });
// //   }
// // });

// // // Manual log entry (Log Employee Attendance modal)
// // app.post('/attendance', verifyToken, async (req, res) => {
// //   const { employee_name, employee_id, log_date, check_in, check_out, type, status } = req.body;

// //   if (!employee_name || !log_date) {
// //     return res.status(400).json({ message: 'Employee name and date are required.' });
// //   }

// //   try {
// //     const [result] = await pool.query(
// //       `INSERT INTO attendance_logs (employee_name, employee_id, log_date, check_in, check_out, type, status)
// //        VALUES (?, ?, ?, ?, ?, ?, ?)
// //        ON DUPLICATE KEY UPDATE check_in = VALUES(check_in), check_out = VALUES(check_out),
// //                                type = VALUES(type), status = VALUES(status)`,
// //       [employee_name, employee_id || null, log_date, check_in || null, check_out || null, type || 'Office', status || 'Present']
// //     );
// //     res.status(201).json({ message: 'Attendance logged.', id: result.insertId });
// //   } catch (err) {
// //     console.log('Create attendance error:', err);
// //     res.status(500).json({ message: 'Could not log attendance.' });
// //   }
// // });

// // // Check-in (quick check-in button — no photo)
// // app.post('/attendance/check-in', verifyToken, async (req, res) => {
// //   const { employee_name } = req.body;
// //   if (!employee_name) return res.status(400).json({ message: 'employee_name is required.' });

// //   const now = new Date();
// //   const checkInTime = now.toTimeString().slice(0, 5); // HH:MM
// //   const today = now.toISOString().slice(0, 10);
// //   const WORK_DAY_START_MINUTES = 10 * 60; // 10:00 AM — adjust to your shift start
// //   const nowMinutes = now.getHours() * 60 + now.getMinutes();
// //   const status = nowMinutes > WORK_DAY_START_MINUTES ? 'Late' : 'Present';

// //   try {
// //     const [existing] = await pool.query(
// //       `SELECT id, check_in FROM attendance_logs WHERE employee_name = ? AND log_date = ?`,
// //       [employee_name, today]
// //     );

// //     if (existing.length > 0 && existing[0].check_in) {
// //       return res.status(409).json({ message: `Already checked in today at ${existing[0].check_in}.` });
// //     }

// //     if (existing.length > 0) {
// //       await pool.query(
// //         `UPDATE attendance_logs SET check_in = ?, status = ? WHERE id = ?`,
// //         [checkInTime, status, existing[0].id]
// //       );
// //     } else {
// //       await pool.query(
// //         `INSERT INTO attendance_logs (employee_name, log_date, check_in, type, status) VALUES (?, ?, ?, 'Office', ?)`,
// //         [employee_name, today, checkInTime, status]
// //       );
// //     }

// //     res.json({ message: `Checked in at ${checkInTime}.`, checkIn: checkInTime, status });
// //   } catch (err) {
// //     console.log('Check-in error:', err);
// //     res.status(500).json({ message: 'Could not check in.' });
// //   }
// // });

// // // Face Check-In — accepts a base64 photo captured from the camera.
// // // No actual face-matching happens here: a successful photo upload is treated
// // // as a valid check-in. Photo is stored (LONGTEXT) purely as an attendance record.
// // //
// // // NOTE: run this once against your DB if the column doesn't exist yet:
// // //   ALTER TABLE attendance_logs ADD COLUMN checkin_photo LONGTEXT NULL;
// // app.post('/attendance/face-checkin', verifyToken, async (req, res) => {
// //   const { employee_name, photo } = req.body;

// //   if (!employee_name) return res.status(400).json({ message: 'employee_name is required.' });
// //   if (!photo) return res.status(400).json({ message: 'photo is required.' });

// //   const now = new Date();
// //   const checkInTime = now.toTimeString().slice(0, 5); // HH:MM
// //   const today = now.toISOString().slice(0, 10);
// //   const WORK_DAY_START_MINUTES = 10 * 60; // 10:00 AM — adjust to your shift start
// //   const nowMinutes = now.getHours() * 60 + now.getMinutes();
// //   const status = nowMinutes > WORK_DAY_START_MINUTES ? 'Late' : 'Present';

// //   try {
// //     const [existing] = await pool.query(
// //       `SELECT id, check_in FROM attendance_logs WHERE employee_name = ? AND log_date = ?`,
// //       [employee_name, today]
// //     );

// //     if (existing.length > 0 && existing[0].check_in) {
// //       return res.status(409).json({ message: `Already checked in today at ${existing[0].check_in}.` });
// //     }

// //     if (existing.length > 0) {
// //       await pool.query(
// //         `UPDATE attendance_logs SET check_in = ?, status = ?, checkin_photo = ? WHERE id = ?`,
// //         [checkInTime, status, photo, existing[0].id]
// //       );
// //     } else {
// //       await pool.query(
// //         `INSERT INTO attendance_logs (employee_name, log_date, check_in, type, status, checkin_photo)
// //          VALUES (?, ?, ?, 'Office', ?, ?)`,
// //         [employee_name, today, checkInTime, status, photo]
// //       );
// //     }

// //     res.json({ message: `Face check-in recorded at ${checkInTime}.`, checkIn: checkInTime, status });
// //   } catch (err) {
// //     console.log('Face check-in error:', err);
// //     res.status(500).json({ message: 'Could not complete face check-in.' });
// //   }
// // });

// // // Check-out
// // app.post('/attendance/check-out', verifyToken, async (req, res) => {
// //   const { employee_name } = req.body;
// //   if (!employee_name) return res.status(400).json({ message: 'employee_name is required.' });

// //   const now = new Date();
// //   const checkOutTime = now.toTimeString().slice(0, 5);
// //   const today = now.toISOString().slice(0, 10);

// //   try {
// //     const [existing] = await pool.query(
// //       `SELECT id, check_in, check_out FROM attendance_logs WHERE employee_name = ? AND log_date = ?`,
// //       [employee_name, today]
// //     );

// //     if (existing.length === 0 || !existing[0].check_in) {
// //       return res.status(400).json({ message: 'Please check in first before checking out.' });
// //     }
// //     if (existing[0].check_out) {
// //       return res.status(409).json({ message: `Already checked out today at ${existing[0].check_out}.` });
// //     }

// //     await pool.query(`UPDATE attendance_logs SET check_out = ? WHERE id = ?`, [checkOutTime, existing[0].id]);
// //     res.json({ message: `Checked out at ${checkOutTime}.`, checkOut: checkOutTime });
// //   } catch (err) {
// //     console.log('Check-out error:', err);
// //     res.status(500).json({ message: 'Could not check out.' });
// //   }
// // });

// // // ---------------------------------------------------------------------------
// // // LEAVE REQUESTS
// // // ---------------------------------------------------------------------------
// // app.get('/leave-requests', verifyToken, async (req, res) => {
// //   try {
// //     const [rows] = await pool.query(
// //       `SELECT id, employee_name AS name, department, leave_type AS leaveType,
// //               start_date AS startDate, end_date AS endDate, reason, status
// //        FROM leave_requests WHERE status = 'Pending' ORDER BY id DESC`
// //     );
// //     res.json({ requests: rows });
// //   } catch (err) {
// //     console.log('Fetch leave requests error:', err);
// //     res.status(500).json({ message: 'Could not fetch leave requests.' });
// //   }
// // });

// // app.post('/leave-requests', verifyToken, async (req, res) => {
// //   const { employee_name, department, leave_type, start_date, end_date, reason } = req.body;

// //   if (!employee_name || !start_date || !end_date || !reason) {
// //     return res.status(400).json({ message: 'Employee name, dates and reason are required.' });
// //   }

// //   try {
// //     const [result] = await pool.query(
// //       `INSERT INTO leave_requests (employee_name, department, leave_type, start_date, end_date, reason)
// //        VALUES (?, ?, ?, ?, ?, ?)`,
// //       [employee_name, department || null, leave_type || 'Sick Leave', start_date, end_date, reason]
// //     );
// //     res.status(201).json({ message: 'Leave request submitted.', id: result.insertId });
// //   } catch (err) {
// //     console.log('Create leave request error:', err);
// //     res.status(500).json({ message: 'Could not submit leave request.' });
// //   }
// // });

// // // Approve/Reject a pending leave request (optional — for admin action)
// // app.put('/leave-requests/:id', verifyToken, async (req, res) => {
// //   const { status } = req.body; // 'Approved' | 'Rejected'
// //   if (!['Approved', 'Rejected'].includes(status)) {
// //     return res.status(400).json({ message: "status must be 'Approved' or 'Rejected'." });
// //   }

// //   try {
// //     await pool.query(`UPDATE leave_requests SET status = ? WHERE id = ?`, [status, req.params.id]);
// //     res.json({ message: `Leave request ${status.toLowerCase()}.` });
// //   } catch (err) {
// //     console.log('Update leave request error:', err);
// //     res.status(500).json({ message: 'Could not update leave request.' });
// //   }
// // });


// // // ---------------------------------------------------------------------------
// // // CLIENTS
// // // ---------------------------------------------------------------------------
// // app.get('/clients', verifyToken, async (req, res) => {
// //   try {
// //     const [rows] = await pool.query(`SELECT * FROM clients ORDER BY id DESC`);
// //     res.json({ clients: rows });
// //   } catch (err) {
// //     console.log('Fetch clients error:', err);
// //     res.status(500).json({ message: 'Could not fetch clients.' });
// //   }
// // });

// // app.post('/clients', verifyToken, async (req, res) => {
// //   const {
// //     name,
// //     company,
// //     email,
// //     phone,
// //     address,
// //     notes,
// //     implementation_phase,
// //     delivery_status,
// //     order_description,
// //     changes_requested,
// //   } = req.body;

// //   if (!name) return res.status(400).json({ message: 'Client name is required.' });
// //   if (!email) return res.status(400).json({ message: 'Email address is required.' });

// //   try {
// //     const [result] = await pool.query(
// //       `INSERT INTO clients
// //         (name, company, email, phone, address, notes,
// //          implementation_phase, delivery_status, order_description, changes_requested)
// //        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// //       [
// //         name,
// //         company || null,
// //         email || null,
// //         phone || null,
// //         address || null,
// //         notes || null,
// //         implementation_phase || 'Planning',
// //         delivery_status || 'Pending',
// //         order_description || null,
// //         changes_requested || null,
// //       ]
// //     );
// //     res.status(201).json({ message: 'Client added.', id: result.insertId });
// //   } catch (err) {
// //     console.log('Create client error:', err);
// //     res.status(500).json({ message: 'Could not add client.' });
// //   }
// // });

// // app.put('/clients/:id', verifyToken, async (req, res) => {
// //   const {
// //     name,
// //     company,
// //     email,
// //     phone,
// //     address,
// //     notes,
// //     implementation_phase,
// //     delivery_status,
// //     order_description,
// //     changes_requested,
// //   } = req.body;

// //   if (!name) return res.status(400).json({ message: 'Client name is required.' });
// //   if (!email) return res.status(400).json({ message: 'Email address is required.' });

// //   try {
// //     await pool.query(
// //       `UPDATE clients SET
// //         name=?, company=?, email=?, phone=?, address=?, notes=?,
// //         implementation_phase=?, delivery_status=?, order_description=?, changes_requested=?
// //        WHERE id=?`,
// //       [
// //         name,
// //         company || null,
// //         email || null,
// //         phone || null,
// //         address || null,
// //         notes || null,
// //         implementation_phase || 'Planning',
// //         delivery_status || 'Pending',
// //         order_description || null,
// //         changes_requested || null,
// //         req.params.id,
// //       ]
// //     );
// //     res.json({ message: 'Client updated.' });
// //   } catch (err) {
// //     console.log('Update client error:', err);
// //     res.status(500).json({ message: 'Could not update client.' });
// //   }
// // });

// // app.delete('/clients/:id', verifyToken, async (req, res) => {
// //   try {
// //     await pool.query(`DELETE FROM clients WHERE id=?`, [req.params.id]);
// //     res.json({ message: 'Client deleted.' });
// //   } catch (err) {
// //     console.log('Delete client error:', err);
// //     res.status(500).json({ message: 'Could not delete client.' });
// //   }
// // });
// // app.delete('/clients/:id', verifyToken, async (req, res) => {
// //   try {
// //     await pool.query(`DELETE FROM clients WHERE id=?`, [req.params.id]);
// //     res.json({ message: 'Client deleted.' });
// //   } catch (err) {
// //     console.log('Delete client error:', err);
// //     res.status(500).json({ message: 'Could not delete client.' });
// //   }
// // });

// // // ---------------------------------------------------------------------------
// // // LEADS
// // // ---------------------------------------------------------------------------
// // app.get('/leads', verifyToken, async (req, res) => {
// //   try {
// //     const [rows] = await pool.query(
// //       `SELECT l.*, e.name AS assigned_to_name
// //        FROM leads l
// //        LEFT JOIN employees e ON e.id = l.assigned_to
// //        ORDER BY l.id DESC`
// //     );
// //     res.json({ leads: rows });
// //   } catch (err) {
// //     console.log('Fetch leads error:', err);
// //     res.status(500).json({ message: 'Could not fetch leads.' });
// //   }
// // });

// // app.post('/leads', verifyToken, async (req, res) => {
// //   const { full_name, company_name, email, phone, address, source, status, notes, assigned_to } = req.body;
// //   if (!full_name || !email) {
// //     return res.status(400).json({ message: 'Full name and email are required.' });
// //   }

// //   try {
// //     const [result] = await pool.query(
// //       `INSERT INTO leads (full_name, company_name, email, phone, address, source, status, notes, assigned_to)
// //        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// //       [full_name, company_name || null, email, phone || null, address || null, source || 'Organic Search', status || 'New', notes || null, assigned_to || null]
// //     );
// //     res.status(201).json({ message: 'Lead added.', id: result.insertId });
// //   } catch (err) {
// //     console.log('Create lead error:', err);
// //     res.status(500).json({ message: 'Could not add lead.' });
// //   }
// // });

// // app.put('/leads/:id', verifyToken, async (req, res) => {
// //   const { full_name, company_name, email, phone, address, source, status, notes, assigned_to } = req.body;
// //   try {
// //     await pool.query(
// //       `UPDATE leads SET full_name=?, company_name=?, email=?, phone=?, address=?, source=?, status=?, notes=?, assigned_to=? WHERE id=?`,
// //       [full_name, company_name || null, email, phone || null, address || null, source, status, notes || null, assigned_to || null, req.params.id]
// //     );
// //     res.json({ message: 'Lead updated.' });
// //   } catch (err) {
// //     console.log('Update lead error:', err);
// //     res.status(500).json({ message: 'Could not update lead.' });
// //   }
// // });

// // app.delete('/leads/:id', verifyToken, async (req, res) => {
// //   try {
// //     await pool.query(`DELETE FROM leads WHERE id=?`, [req.params.id]);
// //     res.json({ message: 'Lead deleted.' });
// //   } catch (err) {
// //     console.log('Delete lead error:', err);
// //     res.status(500).json({ message: 'Could not delete lead.' });
// //   }
// // });

// // // ---------------------------------------------------------------------------
// // // PROJECTS
// // // ---------------------------------------------------------------------------
// // app.get('/projects', verifyToken, async (req, res) => {
// //   try {
// //     const [rows] = await pool.query(
// //       `SELECT p.*, c.name AS client_name
// //        FROM projects p
// //        LEFT JOIN clients c ON c.id = p.client_id
// //        ORDER BY p.id DESC`
// //     );
// //     res.json({ projects: rows });
// //   } catch (err) {
// //     console.log('Fetch projects error:', err);
// //     res.status(500).json({ message: 'Could not fetch projects.' });
// //   }
// // });

// // app.post('/projects', verifyToken, async (req, res) => {
// //   const { project_name, description, link_url, status, client_id } = req.body;
// //   if (!project_name) return res.status(400).json({ message: 'Project name is required.' });

// //   try {
// //     const [result] = await pool.query(
// //       `INSERT INTO projects (project_name, description, link_url, status, client_id) VALUES (?, ?, ?, ?, ?)`,
// //       [project_name, description || null, link_url || null, status || 'In Progress', client_id || null]
// //     );
// //     res.status(201).json({ message: 'Project created.', id: result.insertId });
// //   } catch (err) {
// //     console.log('Create project error:', err);
// //     res.status(500).json({ message: 'Could not create project.' });
// //   }
// // });

// // app.put('/projects/:id', verifyToken, async (req, res) => {
// //   const { project_name, description, link_url, status, client_id } = req.body;
// //   try {
// //     await pool.query(
// //       `UPDATE projects SET project_name=?, description=?, link_url=?, status=?, client_id=? WHERE id=?`,
// //       [project_name, description || null, link_url || null, status, client_id || null, req.params.id]
// //     );
// //     res.json({ message: 'Project updated.' });
// //   } catch (err) {
// //     console.log('Update project error:', err);
// //     res.status(500).json({ message: 'Could not update project.' });
// //   }
// // });

// // app.delete('/projects/:id', verifyToken, async (req, res) => {
// //   try {
// //     await pool.query(`DELETE FROM projects WHERE id=?`, [req.params.id]);
// //     res.json({ message: 'Project deleted.' });
// //   } catch (err) {
// //     console.log('Delete project error:', err);
// //     res.status(500).json({ message: 'Could not delete project.' });
// //   }
// // });

// // // ---------------------------------------------------------------------------
// // // DEALS (Sales Pipeline)
// // // ---------------------------------------------------------------------------
// // app.get('/deals', verifyToken, async (req, res) => {
// //   try {
// //     const [rows] = await pool.query(
// //       `SELECT d.*, e.name AS assigned_to_name
// //        FROM deals d
// //        LEFT JOIN employees e ON e.id = d.assigned_to
// //        ORDER BY d.id DESC`
// //     );
// //     res.json({ deals: rows });
// //   } catch (err) {
// //     console.log('Fetch deals error:', err);
// //     res.status(500).json({ message: 'Could not fetch deals.' });
// //   }
// // });

// // app.post('/deals', verifyToken, async (req, res) => {
// //   const { client_name, lead_id, client_id, amount, stage, probability, assigned_to, closed_at } = req.body;
// //   if (!client_name || amount === undefined) {
// //     return res.status(400).json({ message: 'Client name and amount are required.' });
// //   }

// //   try {
// //     const [result] = await pool.query(
// //       `INSERT INTO deals (client_name, lead_id, client_id, amount, stage, probability, assigned_to, closed_at)
// //        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
// //       [client_name, lead_id || null, client_id || null, amount, stage || 'Negotiation', probability ?? 50, assigned_to || null, closed_at || null]
// //     );
// //     res.status(201).json({ message: 'Deal added.', id: result.insertId });
// //   } catch (err) {
// //     console.log('Create deal error:', err);
// //     res.status(500).json({ message: 'Could not add deal.' });
// //   }
// // });

// // app.put('/deals/:id', verifyToken, async (req, res) => {
// //   const { client_name, lead_id, client_id, amount, stage, probability, assigned_to, closed_at } = req.body;
// //   try {
// //     await pool.query(
// //       `UPDATE deals SET client_name=?, lead_id=?, client_id=?, amount=?, stage=?, probability=?, assigned_to=?, closed_at=? WHERE id=?`,
// //       [client_name, lead_id || null, client_id || null, amount, stage, probability ?? 50, assigned_to || null, closed_at || null, req.params.id]
// //     );
// //     res.json({ message: 'Deal updated.' });
// //   } catch (err) {
// //     console.log('Update deal error:', err);
// //     res.status(500).json({ message: 'Could not update deal.' });
// //   }
// // });

// // app.delete('/deals/:id', verifyToken, async (req, res) => {
// //   try {
// //     await pool.query(`DELETE FROM deals WHERE id=?`, [req.params.id]);
// //     res.json({ message: 'Deal deleted.' });
// //   } catch (err) {
// //     console.log('Delete deal error:', err);
// //     res.status(500).json({ message: 'Could not delete deal.' });
// //   }
// // });

// // // ---------------------------------------------------------------------------
// // // COMPANY SETTINGS (single row, id = 1)
// // // ---------------------------------------------------------------------------
// // app.get('/settings/company', verifyToken, async (req, res) => {
// //   try {
// //     const [rows] = await pool.query(`SELECT * FROM company_settings WHERE id = 1`);
// //     res.json({ settings: rows[0] || null });
// //   } catch (err) {
// //     console.log('Fetch company settings error:', err);
// //     res.status(500).json({ message: 'Could not fetch company settings.' });
// //   }
// // });

// // app.put('/settings/company', verifyToken, async (req, res) => {
// //   const { logo_url, company_name, industry, phone, email, website, tax_id, currency, timezone, address } = req.body;
// //   try {
// //     await pool.query(
// //       `UPDATE company_settings
// //        SET logo_url=?, company_name=?, industry=?, phone=?, email=?, website=?, tax_id=?, currency=?, timezone=?, address=?
// //        WHERE id = 1`,
// //       [logo_url || null, company_name || null, industry || null, phone || null, email || null, website || null, tax_id || null, currency || null, timezone || null, address || null]
// //     );
// //     res.json({ message: 'Company settings updated.' });
// //   } catch (err) {
// //     console.log('Update company settings error:', err);
// //     res.status(500).json({ message: 'Could not update company settings.' });
// //   }
// // });

// // // ---------------------------------------------------------------------------
// // // NOTIFICATION SETTINGS (per user_key — upsert)
// // // ---------------------------------------------------------------------------
// // app.get('/settings/notifications', verifyToken, async (req, res) => {
// //   const userKey = req.user.role === 'admin' ? 'admin' : String(req.user.id);
// //   try {
// //     const [rows] = await pool.query(`SELECT * FROM notification_settings WHERE user_key = ?`, [userKey]);
// //     res.json({
// //       settings: rows[0] || {
// //         user_key: userKey,
// //         email_notifications: true,
// //         push_notifications: false,
// //         lead_assignments: true,
// //         task_deadlines: true,
// //       },
// //     });
// //   } catch (err) {
// //     console.log('Fetch notification settings error:', err);
// //     res.status(500).json({ message: 'Could not fetch notification settings.' });
// //   }
// // });

// // app.put('/settings/notifications', verifyToken, async (req, res) => {
// //   const userKey = req.user.role === 'admin' ? 'admin' : String(req.user.id);
// //   const { email_notifications, push_notifications, lead_assignments, task_deadlines } = req.body;

// //   try {
// //     await pool.query(
// //       `INSERT INTO notification_settings (user_key, email_notifications, push_notifications, lead_assignments, task_deadlines)
// //        VALUES (?, ?, ?, ?, ?)
// //        ON DUPLICATE KEY UPDATE
// //          email_notifications = VALUES(email_notifications),
// //          push_notifications = VALUES(push_notifications),
// //          lead_assignments = VALUES(lead_assignments),
// //          task_deadlines = VALUES(task_deadlines)`,
// //       [userKey, !!email_notifications, !!push_notifications, !!lead_assignments, !!task_deadlines]
// //     );
// //     res.json({ message: 'Notification settings saved.' });
// //   } catch (err) {
// //     console.log('Update notification settings error:', err);
// //     res.status(500).json({ message: 'Could not save notification settings.' });
// //   }
// // });



// // // Replace both earlier routes with these

// // app.post('/employees/enroll-fingerprint', authenticateToken, async (req, res) => {
// //   const { employee_username, device_platform } = req.body;
// //   if (!employee_username) {
// //     return res.status(400).json({ message: 'employee_username is required.' });
// //   }

// //   try {
// //     // Trust the DB, not the client, for who this actually is
// //     const [rows] = await pool.query(`SELECT name FROM employees WHERE username = ? LIMIT 1`, [employee_username]);
// //     if (rows.length === 0) {
// //       return res.status(404).json({ message: 'No employee found with that username.' });
// //     }
// //     const employeeName = rows[0].name;

// //     await pool.query(
// //       `INSERT INTO fingerprint_enrollments (employee_username, device_platform)
// //        VALUES (?, ?)
// //        ON DUPLICATE KEY UPDATE device_platform = VALUES(device_platform), enrolled_at = CURRENT_TIMESTAMP`,
// //       [employee_username, device_platform || null]
// //     );

// //     return res.status(200).json({ message: `${employeeName} enrolled successfully for fingerprint check-in.` });
// //   } catch (err) {
// //     console.error('Enroll fingerprint error:', err);
// //     return res.status(500).json({ message: 'Server error while enrolling fingerprint.' });
// //   }
// // });

// // app.post('/attendance/fingerprint-checkin', authenticateToken, async (req, res) => {
// //   const { employee_username, verified } = req.body;
// //   if (!employee_username || !verified) {
// //     return res.status(400).json({ message: 'employee_username and a successful scan are required.' });
// //   }

// //   try {
// //     const [enrolled] = await pool.query(
// //       `SELECT e.name FROM fingerprint_enrollments f
// //        JOIN employees e ON e.username = f.employee_username
// //        WHERE f.employee_username = ? LIMIT 1`,
// //       [employee_username]
// //     );
// //     if (enrolled.length === 0) {
// //       return res.status(404).json({ message: 'This employee is not enrolled for fingerprint check-in.' });
// //     }
// //     const employeeName = enrolled[0].name;

// //     const now = new Date();
// //     const logDate = now.toISOString().slice(0, 10);
// //     const checkInTime = now.toTimeString().slice(0, 5);
// //     const status = checkInTime > '10:00' ? 'Late' : 'Present';

// //     await pool.query(
// //       `INSERT INTO attendance (employee_name, log_date, check_in, type, status) VALUES (?, ?, ?, 'Office', ?)`,
// //       [employeeName, logDate, checkInTime, status]
// //     );

// //     return res.status(200).json({ message: `${employeeName} checked in via fingerprint at ${checkInTime}.` });
// //   } catch (err) {
// //     console.error('Fingerprint check-in error:', err);
// //     return res.status(500).json({ message: 'Server error during fingerprint check-in.' });
// //   }
// // });


// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, '0.0.0.0', () => {
// //   console.log(`Server running on port ${PORT}`);
// // });


// // server.js
// require('dotenv').config();
// const express = require('express');
// const mysql = require('mysql2/promise');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// // FIX: default body-parser limit is 100kb — a base64 face-check-in photo blows past
// // that instantly, causing PayloadTooLargeError. Bumped to 10mb.
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // ---------------------------------------------------------------------------
// // MySQL pool
// // ---------------------------------------------------------------------------
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
// });

// // ---------------------------------------------------------------------------
// // Mailer (Gmail + App Password)
// // ---------------------------------------------------------------------------
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
// });

// async function sendCredentialsMail({ toEmail, toName, username, password, role }) {
//   const mailOptions = {
//     from: `"JOD Tech CRM" <${process.env.MAIL_USER}>`,
//     to: toEmail,
//     subject: 'Welcome to JOD Tech CRM — Your Login Credentials',
//     html: `
//       <div style="margin:0; padding:0; background-color:#F1F5F4; font-family: Arial, Helvetica, sans-serif;">
//         <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F1F5F4; padding: 32px 0;">
//           <tr>
//             <td align="center">
//               <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 10px rgba(3,46,40,0.08);">

//                 <!-- Header with logo -->
//                 <tr>
//                   <td style="background-color:#09685A; padding: 28px 32px; text-align: center;">
//                     <img src="https://www.jodtech.in/assets/jod-CjP44g3I.jpeg" alt="JOD Tech" width="140" style="display:block; margin: 0 auto;" />
//                   </td>
//                 </tr>

//                 <!-- Body -->
//                 <tr>
//                   <td style="padding: 32px;">
//                     <h2 style="margin:0 0 8px; color:#032E28; font-size: 20px;">Welcome, ${toName}!</h2>
//                     <p style="margin:0 0 24px; color:#5B6B68; font-size: 14px; line-height: 1.6;">
//                       Your employee account has been created on <strong>JOD Tech CRM</strong>. Use the credentials below to log in.
//                     </p>

//                     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #E4ECEA; border-radius: 10px; overflow: hidden;">
//                       <tr style="background-color:#F7FAF9;">
//                         <td style="padding: 12px 16px; font-size: 12px; color:#5B6B68; font-weight: 600; width: 40%;">USERNAME</td>
//                         <td style="padding: 12px 16px; font-size: 14px; color:#032E28; font-weight: 700;">${username}</td>
//                       </tr>
//                       <tr style="border-top: 1px solid #E4ECEA;">
//                         <td style="padding: 12px 16px; font-size: 12px; color:#5B6B68; font-weight: 600;">PASSWORD</td>
//                         <td style="padding: 12px 16px; font-size: 14px; color:#032E28; font-weight: 700;">${password}</td>
//                       </tr>
//                       <tr style="border-top: 1px solid #E4ECEA; background-color:#F7FAF9;">
//                         <td style="padding: 12px 16px; font-size: 12px; color:#5B6B68; font-weight: 600;">ROLE</td>
//                         <td style="padding: 12px 16px; font-size: 14px; color:#032E28; font-weight: 700;">${role}</td>
//                       </tr>
//                     </table>

//                     <div style="margin-top: 24px; padding: 14px 16px; background-color:#FFF7ED; border-left: 3px solid #E0A324; border-radius: 6px;">
//                       <p style="margin:0; font-size: 12.5px; color:#7A5A17; line-height: 1.5;">
//                         For security, please change your password immediately after your first login. Do not share these credentials with anyone.
//                       </p>
//                     </div>
//                   </td>
//                 </tr>

//                 <!-- Footer -->
//                 <tr>
//                   <td style="padding: 20px 32px; background-color:#F7FAF9; border-top: 1px solid #E4ECEA; text-align: center;">
//                     <p style="margin:0; font-size: 11.5px; color:#9AA7A4;">
//                       &copy; ${new Date().getFullYear()} JOD Tech CRM. All rights reserved.
//                     </p>
//                   </td>
//                 </tr>

//               </table>
//             </td>
//           </tr>
//         </table>
//       </div>
//     `,
//   };
//   return transporter.sendMail(mailOptions);
// }

// // ---------------------------------------------------------------------------
// // JWT middleware
// // ---------------------------------------------------------------------------
// function verifyToken(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token provided.', code: 'NO_TOKEN' });
//   }
//   const token = authHeader.split(' ')[1];
//   try {
//     req.user = jwt.verify(token, process.env.JWT_SECRET);
//     next();
//   } catch (err) {
//     const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID';
//     return res.status(401).json({ message: 'Invalid or expired token.', code });
//   }
// }

// // ---------------------------------------------------------------------------
// // Helper: generate next username based on role
// // TL0001 for MD (Team Lead), EMP0001... for everyone else
// // ---------------------------------------------------------------------------
// async function generateUsername(role) {
//   const prefix = role === 'MD' ? 'TL' : 'EMP';

//   const [rows] = await pool.query(
//     `SELECT username FROM employees WHERE username LIKE ? ORDER BY id DESC LIMIT 1`,
//     [`${prefix}%`]
//   );

//   let nextNumber = 1;
//   if (rows.length > 0) {
//     const lastUsername = rows[0].username; // e.g. EMP0007
//     const lastNumber = parseInt(lastUsername.replace(prefix, ''), 10);
//     nextNumber = lastNumber + 1;
//   }

//   return `${prefix}${String(nextNumber).padStart(4, '0')}`;
// }

// // ---------------------------------------------------------------------------
// // GET all employees
// // ---------------------------------------------------------------------------
// app.get('/employees', verifyToken, async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT id, username, name, email, role, specialization, created_at FROM employees ORDER BY id DESC`
//     );
//     res.json({ employees: rows });
//   } catch (err) {
//     console.log('Fetch employees error:', err);
//     res.status(500).json({ message: 'Could not fetch employees.' });
//   }
// });

// // ---------------------------------------------------------------------------
// // POST create employee (auto-generates username, hashes password, emails it)
// // ---------------------------------------------------------------------------
// app.post('/employees', verifyToken, async (req, res) => {
//   const { name, email, password, role, specialization } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({ message: 'Name, email and password are required.' });
//   }

//   try {
//     const [existing] = await pool.query(`SELECT id FROM employees WHERE email = ?`, [email]);
//     if (existing.length > 0) {
//       return res.status(409).json({ message: 'An account with this email already exists.' });
//     }

//     const username = await generateUsername(role || 'Employee');
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const [result] = await pool.query(
//       `INSERT INTO employees (username, name, email, password, role, specialization) VALUES (?, ?, ?, ?, ?, ?)`,
//       [username, name, email, hashedPassword, role || 'Employee', specialization || null]
//     );

//     // Send plain password in mail BEFORE it's lost — hashed version stays in DB only
//     try {
//       await sendCredentialsMail({
//         toEmail: email,
//         toName: name,
//         username,
//         password, // plain text, only used here for the email
//         role: role || 'Employee',
//       });
//     } catch (mailErr) {
//       console.log('Mail send failed:', mailErr.message);
//       // Don't fail the whole request just because mail failed —
//       // account is already created, so let the frontend know via response.
//     }

//     res.status(201).json({
//       message: 'Employee account created.',
//       employee: { id: result.insertId, username, name, email, role, specialization },
//     });
//   } catch (err) {
//     console.log('Create employee error:', err);
//     res.status(500).json({ message: 'Could not create employee account.' });
//   }
// });

// // ---------------------------------------------------------------------------
// // PUT update employee (password optional — only updates if provided)
// // ---------------------------------------------------------------------------
// app.put('/employees/:id', verifyToken, async (req, res) => {
//   const { id } = req.params;
//   const { name, email, password, role, specialization } = req.body;

//   try {
//     if (password) {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       await pool.query(
//         `UPDATE employees SET name=?, email=?, password=?, role=?, specialization=? WHERE id=?`,
//         [name, email, hashedPassword, role, specialization || null, id]
//       );

//       const [userRow] = await pool.query(`SELECT username FROM employees WHERE id=?`, [id]);
//       const username = userRow[0]?.username;

//       try {
//         await sendCredentialsMail({ toEmail: email, toName: name, username, password, role });
//       } catch (mailErr) {
//         console.log('Mail send failed:', mailErr.message);
//       }
//     } else {
//       await pool.query(
//         `UPDATE employees SET name=?, email=?, role=?, specialization=? WHERE id=?`,
//         [name, email, role, specialization || null, id]
//       );
//     }

//     res.json({ message: 'Employee updated.' });
//   } catch (err) {
//     console.log('Update employee error:', err);
//     res.status(500).json({ message: 'Could not update employee.' });
//   }
// });

// // ---------------------------------------------------------------------------
// // DELETE employee
// // ---------------------------------------------------------------------------
// app.delete('/employees/:id', verifyToken, async (req, res) => {
//   try {
//     await pool.query(`DELETE FROM employees WHERE id=?`, [req.params.id]);
//     res.json({ message: 'Employee deleted.' });
//   } catch (err) {
//     console.log('Delete employee error:', err);
//     res.status(500).json({ message: 'Could not delete employee.' });
//   }
// });

// // ---------------------------------------------------------------------------
// // (Keep your existing login / other routes below this line, if any)
// // ---------------------------------------------------------------------------


// // ---------------------------------------------------------------------------
// // POST /admin/login — issues a real JWT so protected routes work
// // ---------------------------------------------------------------------------
// // ---------------------------------------------------------------------------
// // POST /login — unified login for Admin + Employees.
// // Checks the hardcoded admin credentials first, then falls back to the
// // employees table (bcrypt-compared password). Always returns `role` so the
// // frontend knows which dashboard stack to land on.
// // ---------------------------------------------------------------------------
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const ADMIN_EMAIL = 'admin@jodtech.com';
//   const ADMIN_PASSWORD = 'admin123';

//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required.' });
//   }

//   const normalizedEmail = email.trim().toLowerCase();

//   // ---- 1. Hardcoded admin check ----
//   if (normalizedEmail === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
//     let [rows] = await pool.query(`SELECT id FROM employees WHERE email = ?`, [ADMIN_EMAIL]);
//     let employeeId = rows[0]?.id;

//     if (!employeeId) {
//       const username = await generateUsername('MD');
//       const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
//       const [result] = await pool.query(
//         `INSERT INTO employees (username, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
//         [username, 'Admin', ADMIN_EMAIL, hashedPassword, 'MD']
//       );
//       employeeId = result.insertId;
//     }

//     const token = jwt.sign(
//       { id: employeeId, role: 'admin', email: ADMIN_EMAIL },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     return res.json({ token, role: 'admin', name: 'Admin' });
//   }

//   // ---- 2. Employee check (against employees table) ----
//   try {
//     // FIX: LOWER(email) so 'John@Company.com' in the DB still matches
//     // 'john@company.com' typed on the login screen.
//     const [rows] = await pool.query(
//       `SELECT id, name, email, password, role, username FROM employees WHERE LOWER(email) = ?`,
//       [normalizedEmail]
//     );

//     console.log(`[LOGIN] email="${normalizedEmail}" | rows found=${rows.length}`);

//     if (rows.length === 0) {
//       return res.status(401).json({ message: 'Invalid email or password.' });
//     }

//     const employee = rows[0];

//     // FIX: guard against a null/blank password column (e.g. row inserted
//     // manually without bcrypt) — bcrypt.compare throws on a non-hash string.
//     if (!employee.password) {
//       console.log(`[LOGIN] employee id=${employee.id} has no password set in DB.`);
//       return res.status(401).json({ message: 'This account has no password set. Contact admin.' });
//     }

//     let passwordMatches = false;
//     try {
//       passwordMatches = await bcrypt.compare(password, employee.password);
//     } catch (compareErr) {
//       // employee.password isn't a valid bcrypt hash (likely plain text in DB)
//       console.log(`[LOGIN] bcrypt.compare failed for id=${employee.id}:`, compareErr.message);
//       return res.status(500).json({ message: 'Account password is stored incorrectly. Recreate this employee account.' });
//     }

//     console.log(`[LOGIN] password match for id=${employee.id}:`, passwordMatches);

//     if (!passwordMatches) {
//       return res.status(401).json({ message: 'Invalid email or password.' });
//     }

//     const token = jwt.sign(
//       { id: employee.id, role: employee.role, email: employee.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     return res.json({
//       token,
//       role: employee.role, // 'MD' | 'Developer' | 'Marketing' | 'HR' | 'Employee'
//       name: employee.name,
//       username: employee.username,
//     });
//   } catch (err) {
//     console.log('Login error:', err);
//     return res.status(500).json({ message: 'Server error during login.' });
//   }
// });

// // ---------------------------------------------------------------------------
// // FOLLOW-UPS
// // ---------------------------------------------------------------------------
// app.get('/followups', verifyToken, async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT id, client_name, interaction_type, follow_up_date, time_slot, status, notes, created_at
//        FROM followups ORDER BY follow_up_date DESC, id DESC`
//     );
//     res.json({ followups: rows });
//   } catch (err) {
//     console.log('Fetch followups error:', err);
//     res.status(500).json({ message: 'Could not fetch follow-ups.' });
//   }
// });

// app.post('/followups', verifyToken, async (req, res) => {
//   const { client_name, interaction_type, follow_up_date, time_slot, status, notes } = req.body;

//   if (!client_name || !follow_up_date || !notes) {
//     return res.status(400).json({ message: 'Client name, follow-up date and notes are required.' });
//   }

//   try {
//     const [result] = await pool.query(
//       `INSERT INTO followups (client_name, interaction_type, follow_up_date, time_slot, status, notes, created_by)
//        VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [client_name, interaction_type || 'Call Notes', follow_up_date, time_slot || null, status || 'Scheduled', notes, req.user?.id || null]
//     );
//     res.status(201).json({ message: 'Follow-up scheduled.', id: result.insertId });
//   } catch (err) {
//     console.log('Create followup error:', err);
//     res.status(500).json({ message: 'Could not schedule follow-up.' });
//   }
// });

// // ---------------------------------------------------------------------------
// // TASKS
// // ---------------------------------------------------------------------------
// app.get('/tasks', verifyToken, async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT t.id, t.title, t.description AS subtitle, t.priority, t.status, t.due_date, t.notes,
//               t.assigned_to, ae.name AS assigned_to_name,
//               t.assigned_by, ab.name AS assigned_by_name,
//               t.created_at
//        FROM tasks t
//        LEFT JOIN employees ae ON ae.id = t.assigned_to
//        LEFT JOIN employees ab ON ab.id = t.assigned_by
//        ORDER BY t.id DESC`
//     );
//     res.json({ tasks: rows });
//   } catch (err) {
//     console.log('Fetch tasks error:', err);
//     res.status(500).json({ message: 'Could not fetch tasks.' });
//   }
// });

// app.post('/tasks', verifyToken, async (req, res) => {
//   const { title, description, assigned_to, priority, status, due_date, notes } = req.body;

//   if (!title || !assigned_to) {
//     return res.status(400).json({ message: 'Task title and assignee are required.' });
//   }

//   try {
//     const [result] = await pool.query(
//       `INSERT INTO tasks (title, description, assigned_to, assigned_by, priority, status, due_date, notes)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//       [title, description || null, assigned_to, req.user?.id || null, priority || 'Medium', status || 'todo', due_date || null, notes || null]
//     );
//     res.status(201).json({ message: 'Task assigned.', id: result.insertId });
//   } catch (err) {
//     console.log('Create task error:', err);
//     res.status(500).json({ message: 'Could not assign task.' });
//   }
// });

// // ---------------------------------------------------------------------------
// // WORK UPDATES
// // ---------------------------------------------------------------------------

// // Logged-in user's own update for a given date
// app.get('/work-updates/mine', verifyToken, async (req, res) => {
//   const { date } = req.query;
//   if (!date) return res.status(400).json({ message: 'date query param is required.' });

//   try {
//     const [rows] = await pool.query(
//       `SELECT morning, afternoon, evening FROM work_updates WHERE employee_id = ? AND update_date = ?`,
//       [req.user.id, date]
//     );
//     res.json({ update: rows[0] || { morning: '', afternoon: '', evening: '' } });
//   } catch (err) {
//     console.log('Fetch my work update error:', err);
//     res.status(500).json({ message: 'Could not fetch your update.' });
//   }
// });

// // Create/update today's (or selected date's) update — upsert
// app.post('/work-updates', verifyToken, async (req, res) => {
//   const { date, morning, afternoon, evening } = req.body;
//   if (!date) return res.status(400).json({ message: 'date is required.' });

//   try {
//     await pool.query(
//       `INSERT INTO work_updates (employee_id, update_date, morning, afternoon, evening)
//        VALUES (?, ?, ?, ?, ?)
//        ON DUPLICATE KEY UPDATE morning = VALUES(morning), afternoon = VALUES(afternoon), evening = VALUES(evening)`,
//       [req.user.id, date, morning || '', afternoon || '', evening || '']
//     );
//     res.json({ message: 'Work update saved.' });
//   } catch (err) {
//     console.log('Save work update error:', err);
//     res.status(500).json({ message: 'Could not save your update.' });
//   }
// });

// // Team-wide view for a given date — every employee + their submission status
// app.get('/work-updates/team', verifyToken, async (req, res) => {
//   const { date } = req.query;
//   if (!date) return res.status(400).json({ message: 'date query param is required.' });

//   try {
//     const [rows] = await pool.query(
//       `SELECT e.id, e.name, e.role, e.email,
//               w.morning, w.afternoon, w.evening,
//               CASE WHEN w.id IS NOT NULL AND (w.morning != '' OR w.afternoon != '' OR w.evening != '')
//                    THEN 'Submitted' ELSE 'Not Submitted' END AS status
//        FROM employees e
//        LEFT JOIN work_updates w ON w.employee_id = e.id AND w.update_date = ?
//        ORDER BY e.name ASC`,
//       [date]
//     );
//     res.json({ employees: rows });
//   } catch (err) {
//     console.log('Fetch team updates error:', err);
//     res.status(500).json({ message: 'Could not load team updates.' });
//   }
// });

// // ---------------------------------------------------------------------------
// // ATTENDANCE LOGS
// // ---------------------------------------------------------------------------
// app.get('/attendance', verifyToken, async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT id, employee_name AS employee, log_date AS date, check_in AS checkIn,
//               check_out AS checkOut, type, status
//        FROM attendance_logs ORDER BY log_date DESC, id DESC`
//     );
//     res.json({ logs: rows });
//   } catch (err) {
//     console.log('Fetch attendance error:', err);
//     res.status(500).json({ message: 'Could not fetch attendance logs.' });
//   }
// });

// // Manual log entry (Log Employee Attendance modal)
// app.post('/attendance', verifyToken, async (req, res) => {
//   const { employee_name, employee_id, log_date, check_in, check_out, type, status } = req.body;

//   if (!employee_name || !log_date) {
//     return res.status(400).json({ message: 'Employee name and date are required.' });
//   }

//   try {
//     const [result] = await pool.query(
//       `INSERT INTO attendance_logs (employee_name, employee_id, log_date, check_in, check_out, type, status)
//        VALUES (?, ?, ?, ?, ?, ?, ?)
//        ON DUPLICATE KEY UPDATE check_in = VALUES(check_in), check_out = VALUES(check_out),
//                                type = VALUES(type), status = VALUES(status)`,
//       [employee_name, employee_id || null, log_date, check_in || null, check_out || null, type || 'Office', status || 'Present']
//     );
//     res.status(201).json({ message: 'Attendance logged.', id: result.insertId });
//   } catch (err) {
//     console.log('Create attendance error:', err);
//     res.status(500).json({ message: 'Could not log attendance.' });
//   }
// });

// // Check-in (quick check-in button — no photo)
// app.post('/attendance/check-in', verifyToken, async (req, res) => {
//   const { employee_name } = req.body;
//   if (!employee_name) return res.status(400).json({ message: 'employee_name is required.' });

//   const now = new Date();
//   const checkInTime = now.toTimeString().slice(0, 5); // HH:MM
//   const today = now.toISOString().slice(0, 10);
//   const WORK_DAY_START_MINUTES = 10 * 60; // 10:00 AM — adjust to your shift start
//   const nowMinutes = now.getHours() * 60 + now.getMinutes();
//   const status = nowMinutes > WORK_DAY_START_MINUTES ? 'Late' : 'Present';

//   try {
//     const [existing] = await pool.query(
//       `SELECT id, check_in FROM attendance_logs WHERE employee_name = ? AND log_date = ?`,
//       [employee_name, today]
//     );

//     if (existing.length > 0 && existing[0].check_in) {
//       return res.status(409).json({ message: `Already checked in today at ${existing[0].check_in}.` });
//     }

//     if (existing.length > 0) {
//       await pool.query(
//         `UPDATE attendance_logs SET check_in = ?, status = ? WHERE id = ?`,
//         [checkInTime, status, existing[0].id]
//       );
//     } else {
//       await pool.query(
//         `INSERT INTO attendance_logs (employee_name, log_date, check_in, type, status) VALUES (?, ?, ?, 'Office', ?)`,
//         [employee_name, today, checkInTime, status]
//       );
//     }

//     res.json({ message: `Checked in at ${checkInTime}.`, checkIn: checkInTime, status });
//   } catch (err) {
//     console.log('Check-in error:', err);
//     res.status(500).json({ message: 'Could not check in.' });
//   }
// });

// // Face Check-In — accepts a base64 photo captured from the camera.
// // No actual face-matching happens here: a successful photo upload is treated
// // as a valid check-in. Photo is stored (LONGTEXT) purely as an attendance record.
// //
// // NOTE: run this once against your DB if the column doesn't exist yet:
// //   ALTER TABLE attendance_logs ADD COLUMN checkin_photo LONGTEXT NULL;
// app.post('/attendance/face-checkin', verifyToken, async (req, res) => {
//   const { employee_name, photo } = req.body;

//   if (!employee_name) return res.status(400).json({ message: 'employee_name is required.' });
//   if (!photo) return res.status(400).json({ message: 'photo is required.' });

//   const now = new Date();
//   const checkInTime = now.toTimeString().slice(0, 5); // HH:MM
//   const today = now.toISOString().slice(0, 10);
//   const WORK_DAY_START_MINUTES = 10 * 60; // 10:00 AM — adjust to your shift start
//   const nowMinutes = now.getHours() * 60 + now.getMinutes();
//   const status = nowMinutes > WORK_DAY_START_MINUTES ? 'Late' : 'Present';

//   try {
//     const [existing] = await pool.query(
//       `SELECT id, check_in FROM attendance_logs WHERE employee_name = ? AND log_date = ?`,
//       [employee_name, today]
//     );

//     if (existing.length > 0 && existing[0].check_in) {
//       return res.status(409).json({ message: `Already checked in today at ${existing[0].check_in}.` });
//     }

//     if (existing.length > 0) {
//       await pool.query(
//         `UPDATE attendance_logs SET check_in = ?, status = ?, checkin_photo = ? WHERE id = ?`,
//         [checkInTime, status, photo, existing[0].id]
//       );
//     } else {
//       await pool.query(
//         `INSERT INTO attendance_logs (employee_name, log_date, check_in, type, status, checkin_photo)
//          VALUES (?, ?, ?, 'Office', ?, ?)`,
//         [employee_name, today, checkInTime, status, photo]
//       );
//     }

//     res.json({ message: `Face check-in recorded at ${checkInTime}.`, checkIn: checkInTime, status });
//   } catch (err) {
//     console.log('Face check-in error:', err);
//     res.status(500).json({ message: 'Could not complete face check-in.' });
//   }
// });

// // Check-out
// app.post('/attendance/check-out', verifyToken, async (req, res) => {
//   const { employee_name } = req.body;
//   if (!employee_name) return res.status(400).json({ message: 'employee_name is required.' });

//   const now = new Date();
//   const checkOutTime = now.toTimeString().slice(0, 5);
//   const today = now.toISOString().slice(0, 10);

//   try {
//     const [existing] = await pool.query(
//       `SELECT id, check_in, check_out FROM attendance_logs WHERE employee_name = ? AND log_date = ?`,
//       [employee_name, today]
//     );

//     if (existing.length === 0 || !existing[0].check_in) {
//       return res.status(400).json({ message: 'Please check in first before checking out.' });
//     }
//     if (existing[0].check_out) {
//       return res.status(409).json({ message: `Already checked out today at ${existing[0].check_out}.` });
//     }

//     await pool.query(`UPDATE attendance_logs SET check_out = ? WHERE id = ?`, [checkOutTime, existing[0].id]);
//     res.json({ message: `Checked out at ${checkOutTime}.`, checkOut: checkOutTime });
//   } catch (err) {
//     console.log('Check-out error:', err);
//     res.status(500).json({ message: 'Could not check out.' });
//   }
// });

// // ---------------------------------------------------------------------------
// // FINGERPRINT ENROLLMENT + CHECK-IN
// //
// // Run this once against your DB before using these two routes:
// //
// //   CREATE TABLE IF NOT EXISTS fingerprint_enrollments (
// //     id INT AUTO_INCREMENT PRIMARY KEY,
// //     employee_username VARCHAR(100) NOT NULL UNIQUE,
// //     device_platform VARCHAR(50) DEFAULT NULL,
// //     enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
// //     FOREIGN KEY (employee_username) REFERENCES employees(username)
// //   );
// //
// // (the FOREIGN KEY line needs employees.username to already be UNIQUE —
// // if it isn't yet: ALTER TABLE employees ADD UNIQUE (username);
// // or just drop that line if you'd rather not enforce it.)
// // ---------------------------------------------------------------------------

// // Enroll — saves which employee (by username, looked up from the employees
// // table, never trusted from the client) has completed a fingerprint scan.
// app.post('/employees/enroll-fingerprint', verifyToken, async (req, res) => {
//   const { employee_username, device_platform } = req.body;
//   if (!employee_username) {
//     return res.status(400).json({ message: 'employee_username is required.' });
//   }

//   try {
//     const [rows] = await pool.query(`SELECT name FROM employees WHERE username = ? LIMIT 1`, [employee_username]);
//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'No employee found with that username.' });
//     }
//     const employeeName = rows[0].name;

//     await pool.query(
//       `INSERT INTO fingerprint_enrollments (employee_username, device_platform)
//        VALUES (?, ?)
//        ON DUPLICATE KEY UPDATE device_platform = VALUES(device_platform), enrolled_at = CURRENT_TIMESTAMP`,
//       [employee_username, device_platform || null]
//     );

//     return res.status(200).json({ message: `${employeeName} enrolled successfully for fingerprint check-in.` });
//   } catch (err) {
//     console.error('Enroll fingerprint error:', err);
//     return res.status(500).json({ message: 'Server error while enrolling fingerprint.' });
//   }
// });

// // Fingerprint check-in — verifies the employee is enrolled, then records
// // a check-in the same way /attendance/check-in does (same table, same
// // duplicate-check and Late/Present cutoff logic).
// app.post('/attendance/fingerprint-checkin', verifyToken, async (req, res) => {
//   const { employee_username, verified } = req.body;
//   if (!employee_username || !verified) {
//     return res.status(400).json({ message: 'employee_username and a successful scan are required.' });
//   }

//   try {
//     const [enrolled] = await pool.query(
//       `SELECT e.id AS employee_id, e.name AS employee_name
//        FROM fingerprint_enrollments f
//        JOIN employees e ON e.username = f.employee_username
//        WHERE f.employee_username = ? LIMIT 1`,
//       [employee_username]
//     );
//     if (enrolled.length === 0) {
//       return res.status(404).json({ message: 'This employee is not enrolled for fingerprint check-in.' });
//     }
//     const { employee_id, employee_name } = enrolled[0];

//     const now = new Date();
//     const checkInTime = now.toTimeString().slice(0, 5); // HH:MM
//     const today = now.toISOString().slice(0, 10);
//     const WORK_DAY_START_MINUTES = 10 * 60; // 10:00 AM — same cutoff as /attendance/check-in
//     const nowMinutes = now.getHours() * 60 + now.getMinutes();
//     const status = nowMinutes > WORK_DAY_START_MINUTES ? 'Late' : 'Present';

//     const [existing] = await pool.query(
//       `SELECT id, check_in FROM attendance_logs WHERE employee_name = ? AND log_date = ?`,
//       [employee_name, today]
//     );

//     if (existing.length > 0 && existing[0].check_in) {
//       return res.status(409).json({ message: `${employee_name} already checked in today at ${existing[0].check_in}.` });
//     }

//     if (existing.length > 0) {
//       await pool.query(`UPDATE attendance_logs SET check_in = ?, status = ? WHERE id = ?`, [checkInTime, status, existing[0].id]);
//     } else {
//       await pool.query(
//         `INSERT INTO attendance_logs (employee_name, employee_id, log_date, check_in, type, status)
//          VALUES (?, ?, ?, ?, 'Office', ?)`,
//         [employee_name, employee_id, today, checkInTime, status]
//       );
//     }

//     return res.status(200).json({ message: `${employee_name} checked in via fingerprint at ${checkInTime}.`, checkIn: checkInTime, status });
//   } catch (err) {
//     console.error('Fingerprint check-in error:', err);
//     return res.status(500).json({ message: 'Server error during fingerprint check-in.' });
//   }
// });

// // ---------------------------------------------------------------------------
// // LEAVE REQUESTS
// // ---------------------------------------------------------------------------
// app.get('/leave-requests', verifyToken, async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT id, employee_name AS name, department, leave_type AS leaveType,
//               start_date AS startDate, end_date AS endDate, reason, status
//        FROM leave_requests WHERE status = 'Pending' ORDER BY id DESC`
//     );
//     res.json({ requests: rows });
//   } catch (err) {
//     console.log('Fetch leave requests error:', err);
//     res.status(500).json({ message: 'Could not fetch leave requests.' });
//   }
// });

// app.post('/leave-requests', verifyToken, async (req, res) => {
//   const { employee_name, department, leave_type, start_date, end_date, reason } = req.body;

//   if (!employee_name || !start_date || !end_date || !reason) {
//     return res.status(400).json({ message: 'Employee name, dates and reason are required.' });
//   }

//   try {
//     const [result] = await pool.query(
//       `INSERT INTO leave_requests (employee_name, department, leave_type, start_date, end_date, reason)
//        VALUES (?, ?, ?, ?, ?, ?)`,
//       [employee_name, department || null, leave_type || 'Sick Leave', start_date, end_date, reason]
//     );
//     res.status(201).json({ message: 'Leave request submitted.', id: result.insertId });
//   } catch (err) {
//     console.log('Create leave request error:', err);
//     res.status(500).json({ message: 'Could not submit leave request.' });
//   }
// });

// // Approve/Reject a pending leave request (optional — for admin action)
// app.put('/leave-requests/:id', verifyToken, async (req, res) => {
//   const { status } = req.body; // 'Approved' | 'Rejected'
//   if (!['Approved', 'Rejected'].includes(status)) {
//     return res.status(400).json({ message: "status must be 'Approved' or 'Rejected'." });
//   }

//   try {
//     await pool.query(`UPDATE leave_requests SET status = ? WHERE id = ?`, [status, req.params.id]);
//     res.json({ message: `Leave request ${status.toLowerCase()}.` });
//   } catch (err) {
//     console.log('Update leave request error:', err);
//     res.status(500).json({ message: 'Could not update leave request.' });
//   }
// });


// // ---------------------------------------------------------------------------
// // CLIENTS
// // ---------------------------------------------------------------------------
// app.get('/clients', verifyToken, async (req, res) => {
//   try {
//     const [rows] = await pool.query(`SELECT * FROM clients ORDER BY id DESC`);
//     res.json({ clients: rows });
//   } catch (err) {
//     console.log('Fetch clients error:', err);
//     res.status(500).json({ message: 'Could not fetch clients.' });
//   }
// });

// app.post('/clients', verifyToken, async (req, res) => {
//   const {
//     name,
//     company,
//     email,
//     phone,
//     address,
//     notes,
//     implementation_phase,
//     delivery_status,
//     order_description,
//     changes_requested,
//   } = req.body;

//   if (!name) return res.status(400).json({ message: 'Client name is required.' });
//   if (!email) return res.status(400).json({ message: 'Email address is required.' });

//   try {
//     const [result] = await pool.query(
//       `INSERT INTO clients
//         (name, company, email, phone, address, notes,
//          implementation_phase, delivery_status, order_description, changes_requested)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         name,
//         company || null,
//         email || null,
//         phone || null,
//         address || null,
//         notes || null,
//         implementation_phase || 'Planning',
//         delivery_status || 'Pending',
//         order_description || null,
//         changes_requested || null,
//       ]
//     );
//     res.status(201).json({ message: 'Client added.', id: result.insertId });
//   } catch (err) {
//     console.log('Create client error:', err);
//     res.status(500).json({ message: 'Could not add client.' });
//   }
// });

// app.put('/clients/:id', verifyToken, async (req, res) => {
//   const {
//     name,
//     company,
//     email,
//     phone,
//     address,
//     notes,
//     implementation_phase,
//     delivery_status,
//     order_description,
//     changes_requested,
//   } = req.body;

//   if (!name) return res.status(400).json({ message: 'Client name is required.' });
//   if (!email) return res.status(400).json({ message: 'Email address is required.' });

//   try {
//     await pool.query(
//       `UPDATE clients SET
//         name=?, company=?, email=?, phone=?, address=?, notes=?,
//         implementation_phase=?, delivery_status=?, order_description=?, changes_requested=?
//        WHERE id=?`,
//       [
//         name,
//         company || null,
//         email || null,
//         phone || null,
//         address || null,
//         notes || null,
//         implementation_phase || 'Planning',
//         delivery_status || 'Pending',
//         order_description || null,
//         changes_requested || null,
//         req.params.id,
//       ]
//     );
//     res.json({ message: 'Client updated.' });
//   } catch (err) {
//     console.log('Update client error:', err);
//     res.status(500).json({ message: 'Could not update client.' });
//   }
// });

// app.delete('/clients/:id', verifyToken, async (req, res) => {
//   try {
//     await pool.query(`DELETE FROM clients WHERE id=?`, [req.params.id]);
//     res.json({ message: 'Client deleted.' });
//   } catch (err) {
//     console.log('Delete client error:', err);
//     res.status(500).json({ message: 'Could not delete client.' });
//   }
// });

// // ---------------------------------------------------------------------------
// // LEADS
// // ---------------------------------------------------------------------------
// app.get('/leads', verifyToken, async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT l.*, e.name AS assigned_to_name
//        FROM leads l
//        LEFT JOIN employees e ON e.id = l.assigned_to
//        ORDER BY l.id DESC`
//     );
//     res.json({ leads: rows });
//   } catch (err) {
//     console.log('Fetch leads error:', err);
//     res.status(500).json({ message: 'Could not fetch leads.' });
//   }
// });

// app.post('/leads', verifyToken, async (req, res) => {
//   const { full_name, company_name, email, phone, address, source, status, notes, assigned_to } = req.body;
//   if (!full_name || !email) {
//     return res.status(400).json({ message: 'Full name and email are required.' });
//   }

//   try {
//     const [result] = await pool.query(
//       `INSERT INTO leads (full_name, company_name, email, phone, address, source, status, notes, assigned_to)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [full_name, company_name || null, email, phone || null, address || null, source || 'Organic Search', status || 'New', notes || null, assigned_to || null]
//     );
//     res.status(201).json({ message: 'Lead added.', id: result.insertId });
//   } catch (err) {
//     console.log('Create lead error:', err);
//     res.status(500).json({ message: 'Could not add lead.' });
//   }
// });

// app.put('/leads/:id', verifyToken, async (req, res) => {
//   const { full_name, company_name, email, phone, address, source, status, notes, assigned_to } = req.body;
//   try {
//     await pool.query(
//       `UPDATE leads SET full_name=?, company_name=?, email=?, phone=?, address=?, source=?, status=?, notes=?, assigned_to=? WHERE id=?`,
//       [full_name, company_name || null, email, phone || null, address || null, source, status, notes || null, assigned_to || null, req.params.id]
//     );
//     res.json({ message: 'Lead updated.' });
//   } catch (err) {
//     console.log('Update lead error:', err);
//     res.status(500).json({ message: 'Could not update lead.' });
//   }
// });

// app.delete('/leads/:id', verifyToken, async (req, res) => {
//   try {
//     await pool.query(`DELETE FROM leads WHERE id=?`, [req.params.id]);
//     res.json({ message: 'Lead deleted.' });
//   } catch (err) {
//     console.log('Delete lead error:', err);
//     res.status(500).json({ message: 'Could not delete lead.' });
//   }
// });

// // ---------------------------------------------------------------------------
// // PROJECTS
// // ---------------------------------------------------------------------------
// app.get('/projects', verifyToken, async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT p.*, c.name AS client_name
//        FROM projects p
//        LEFT JOIN clients c ON c.id = p.client_id
//        ORDER BY p.id DESC`
//     );
//     res.json({ projects: rows });
//   } catch (err) {
//     console.log('Fetch projects error:', err);
//     res.status(500).json({ message: 'Could not fetch projects.' });
//   }
// });

// app.post('/projects', verifyToken, async (req, res) => {
//   const { project_name, description, link_url, status, client_id } = req.body;
//   if (!project_name) return res.status(400).json({ message: 'Project name is required.' });

//   try {
//     const [result] = await pool.query(
//       `INSERT INTO projects (project_name, description, link_url, status, client_id) VALUES (?, ?, ?, ?, ?)`,
//       [project_name, description || null, link_url || null, status || 'In Progress', client_id || null]
//     );
//     res.status(201).json({ message: 'Project created.', id: result.insertId });
//   } catch (err) {
//     console.log('Create project error:', err);
//     res.status(500).json({ message: 'Could not create project.' });
//   }
// });

// app.put('/projects/:id', verifyToken, async (req, res) => {
//   const { project_name, description, link_url, status, client_id } = req.body;
//   try {
//     await pool.query(
//       `UPDATE projects SET project_name=?, description=?, link_url=?, status=?, client_id=? WHERE id=?`,
//       [project_name, description || null, link_url || null, status, client_id || null, req.params.id]
//     );
//     res.json({ message: 'Project updated.' });
//   } catch (err) {
//     console.log('Update project error:', err);
//     res.status(500).json({ message: 'Could not update project.' });
//   }
// });

// app.delete('/projects/:id', verifyToken, async (req, res) => {
//   try {
//     await pool.query(`DELETE FROM projects WHERE id=?`, [req.params.id]);
//     res.json({ message: 'Project deleted.' });
//   } catch (err) {
//     console.log('Delete project error:', err);
//     res.status(500).json({ message: 'Could not delete project.' });
//   }
// });

// // ---------------------------------------------------------------------------
// // DEALS (Sales Pipeline)
// // ---------------------------------------------------------------------------
// app.get('/deals', verifyToken, async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT d.*, e.name AS assigned_to_name
//        FROM deals d
//        LEFT JOIN employees e ON e.id = d.assigned_to
//        ORDER BY d.id DESC`
//     );
//     res.json({ deals: rows });
//   } catch (err) {
//     console.log('Fetch deals error:', err);
//     res.status(500).json({ message: 'Could not fetch deals.' });
//   }
// });

// app.post('/deals', verifyToken, async (req, res) => {
//   const { client_name, lead_id, client_id, amount, stage, probability, assigned_to, closed_at } = req.body;
//   if (!client_name || amount === undefined) {
//     return res.status(400).json({ message: 'Client name and amount are required.' });
//   }

//   try {
//     const [result] = await pool.query(
//       `INSERT INTO deals (client_name, lead_id, client_id, amount, stage, probability, assigned_to, closed_at)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//       [client_name, lead_id || null, client_id || null, amount, stage || 'Negotiation', probability ?? 50, assigned_to || null, closed_at || null]
//     );
//     res.status(201).json({ message: 'Deal added.', id: result.insertId });
//   } catch (err) {
//     console.log('Create deal error:', err);
//     res.status(500).json({ message: 'Could not add deal.' });
//   }
// });

// app.put('/deals/:id', verifyToken, async (req, res) => {
//   const { client_name, lead_id, client_id, amount, stage, probability, assigned_to, closed_at } = req.body;
//   try {
//     await pool.query(
//       `UPDATE deals SET client_name=?, lead_id=?, client_id=?, amount=?, stage=?, probability=?, assigned_to=?, closed_at=? WHERE id=?`,
//       [client_name, lead_id || null, client_id || null, amount, stage, probability ?? 50, assigned_to || null, closed_at || null, req.params.id]
//     );
//     res.json({ message: 'Deal updated.' });
//   } catch (err) {
//     console.log('Update deal error:', err);
//     res.status(500).json({ message: 'Could not update deal.' });
//   }
// });

// app.delete('/deals/:id', verifyToken, async (req, res) => {
//   try {
//     await pool.query(`DELETE FROM deals WHERE id=?`, [req.params.id]);
//     res.json({ message: 'Deal deleted.' });
//   } catch (err) {
//     console.log('Delete deal error:', err);
//     res.status(500).json({ message: 'Could not delete deal.' });
//   }
// });

// // ---------------------------------------------------------------------------
// // COMPANY SETTINGS (single row, id = 1)
// // ---------------------------------------------------------------------------
// app.get('/settings/company', verifyToken, async (req, res) => {
//   try {
//     const [rows] = await pool.query(`SELECT * FROM company_settings WHERE id = 1`);
//     res.json({ settings: rows[0] || null });
//   } catch (err) {
//     console.log('Fetch company settings error:', err);
//     res.status(500).json({ message: 'Could not fetch company settings.' });
//   }
// });

// app.put('/settings/company', verifyToken, async (req, res) => {
//   const { logo_url, company_name, industry, phone, email, website, tax_id, currency, timezone, address } = req.body;
//   try {
//     await pool.query(
//       `UPDATE company_settings
//        SET logo_url=?, company_name=?, industry=?, phone=?, email=?, website=?, tax_id=?, currency=?, timezone=?, address=?
//        WHERE id = 1`,
//       [logo_url || null, company_name || null, industry || null, phone || null, email || null, website || null, tax_id || null, currency || null, timezone || null, address || null]
//     );
//     res.json({ message: 'Company settings updated.' });
//   } catch (err) {
//     console.log('Update company settings error:', err);
//     res.status(500).json({ message: 'Could not update company settings.' });
//   }
// });

// // ---------------------------------------------------------------------------
// // NOTIFICATION SETTINGS (per user_key — upsert)
// // ---------------------------------------------------------------------------
// app.get('/settings/notifications', verifyToken, async (req, res) => {
//   const userKey = req.user.role === 'admin' ? 'admin' : String(req.user.id);
//   try {
//     const [rows] = await pool.query(`SELECT * FROM notification_settings WHERE user_key = ?`, [userKey]);
//     res.json({
//       settings: rows[0] || {
//         user_key: userKey,
//         email_notifications: true,
//         push_notifications: false,
//         lead_assignments: true,
//         task_deadlines: true,
//       },
//     });
//   } catch (err) {
//     console.log('Fetch notification settings error:', err);
//     res.status(500).json({ message: 'Could not fetch notification settings.' });
//   }
// });

// app.put('/settings/notifications', verifyToken, async (req, res) => {
//   const userKey = req.user.role === 'admin' ? 'admin' : String(req.user.id);
//   const { email_notifications, push_notifications, lead_assignments, task_deadlines } = req.body;

//   try {
//     await pool.query(
//       `INSERT INTO notification_settings (user_key, email_notifications, push_notifications, lead_assignments, task_deadlines)
//        VALUES (?, ?, ?, ?, ?)
//        ON DUPLICATE KEY UPDATE
//          email_notifications = VALUES(email_notifications),
//          push_notifications = VALUES(push_notifications),
//          lead_assignments = VALUES(lead_assignments),
//          task_deadlines = VALUES(task_deadlines)`,
//       [userKey, !!email_notifications, !!push_notifications, !!lead_assignments, !!task_deadlines]
//     );
//     res.json({ message: 'Notification settings saved.' });
//   } catch (err) {
//     console.log('Update notification settings error:', err);
//     res.status(500).json({ message: 'Could not save notification settings.' });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`);
// });



// server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');
const sharp = require('sharp');


const app = express();
app.use(cors());
// default body-parser limit is 100kb — a base64 face-check-in photo blows past
// that instantly, causing PayloadTooLargeError. Bumped to 10mb.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---------------------------------------------------------------------------
// MySQL pool
// ---------------------------------------------------------------------------
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

async function getEmployeeByName(name) {
  const [rows] = await pool.query(
    `SELECT id, name, username, email, role FROM employees WHERE name = ? LIMIT 1`,
    [name]
  );
  return rows[0] || null;
}

// ---------------------------------------------------------------------------
// Mailer (Gmail + App Password)
// ---------------------------------------------------------------------------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendCredentialsMail({ toEmail, toName, username, password, role }) {
  const mailOptions = {
    from: `"JOD Tech CRM" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Welcome to JOD Tech CRM — Your Login Credentials',
    html: `
      <div style="margin:0; padding:0; background-color:#F1F5F4; font-family: Arial, Helvetica, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F1F5F4; padding: 32px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 10px rgba(3,46,40,0.08);">
                <tr>
                  <td style="background-color:#09685A; padding: 28px 32px; text-align: center;">
                    <img src="https://www.jodtech.in/assets/jod-CjP44g3I.jpeg" alt="JOD Tech" width="140" style="display:block; margin: 0 auto;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px;">
                    <h2 style="margin:0 0 8px; color:#032E28; font-size: 20px;">Welcome, ${toName}!</h2>
                    <p style="margin:0 0 24px; color:#5B6B68; font-size: 14px; line-height: 1.6;">
                      Your employee account has been created on <strong>JOD Tech CRM</strong>. Use the credentials below to log in.
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #E4ECEA; border-radius: 10px; overflow: hidden;">
                      <tr style="background-color:#F7FAF9;">
                        <td style="padding: 12px 16px; font-size: 12px; color:#5B6B68; font-weight: 600; width: 40%;">USERNAME</td>
                        <td style="padding: 12px 16px; font-size: 14px; color:#032E28; font-weight: 700;">${username}</td>
                      </tr>
                      <tr style="border-top: 1px solid #E4ECEA;">
                        <td style="padding: 12px 16px; font-size: 12px; color:#5B6B68; font-weight: 600;">PASSWORD</td>
                        <td style="padding: 12px 16px; font-size: 14px; color:#032E28; font-weight: 700;">${password}</td>
                      </tr>
                      <tr style="border-top: 1px solid #E4ECEA; background-color:#F7FAF9;">
                        <td style="padding: 12px 16px; font-size: 12px; color:#5B6B68; font-weight: 600;">ROLE</td>
                        <td style="padding: 12px 16px; font-size: 14px; color:#032E28; font-weight: 700;">${role}</td>
                      </tr>
                    </table>
                    <div style="margin-top: 24px; padding: 14px 16px; background-color:#FFF7ED; border-left: 3px solid #E0A324; border-radius: 6px;">
                      <p style="margin:0; font-size: 12.5px; color:#7A5A17; line-height: 1.5;">
                        For security, please change your password immediately after your first login. Do not share these credentials with anyone.
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 32px; background-color:#F7FAF9; border-top: 1px solid #E4ECEA; text-align: center;">
                    <p style="margin:0; font-size: 11.5px; color:#9AA7A4;">
                      &copy; ${new Date().getFullYear()} JOD Tech CRM. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
}

// ---------------------------------------------------------------------------
// JWT middleware
// ---------------------------------------------------------------------------
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.', code: 'NO_TOKEN' });
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID';
    return res.status(401).json({ message: 'Invalid or expired token.', code });
  }
}



async function computeImageHash(buffer) {
  const { data } = await sharp(buffer)
    .resize(9, 8, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let bits = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const left = data[row * 9 + col];
      const right = data[row * 9 + col + 1];
      bits += left < right ? '1' : '0';
    }
  }

  // Pack the 64-bit binary string into 16 hex characters for compact storage.
  let hex = '';
  for (let i = 0; i < bits.length; i += 4) {
    hex += parseInt(bits.substr(i, 4), 2).toString(16);
  }
  return hex;
}

function hammingDistanceHex(hexA, hexB) {
  if (!hexA || !hexB || hexA.length !== hexB.length) return Infinity;
  let distance = 0;
  for (let i = 0; i < hexA.length; i++) {
    let xor = parseInt(hexA[i], 16) ^ parseInt(hexB[i], 16);
    while (xor) {
      distance += xor & 1;
      xor >>= 1;
    }
  }
  return distance;
}

// Out of 64 total bits. Lower = stricter. 10 is a reasonably forgiving
// starting point — tune this up/down after testing with real photos.
const FACE_MATCH_MAX_DISTANCE = 20;
// ---------------------------------------------------------------------------
// Helper: generate next username based on role
// TL0001 for MD (Team Lead), EMP0001... for everyone else
// ---------------------------------------------------------------------------
async function generateUsername(role) {
  const prefix = role === 'MD' ? 'TL' : 'EMP';
  const [rows] = await pool.query(
    `SELECT username FROM employees WHERE username LIKE ? ORDER BY id DESC LIMIT 1`,
    [`${prefix}%`]
  );
  let nextNumber = 1;
  if (rows.length > 0) {
    const lastUsername = rows[0].username;
    const lastNumber = parseInt(lastUsername.replace(prefix, ''), 10);
    nextNumber = lastNumber + 1;
  }
  return `${prefix}${String(nextNumber).padStart(4, '0')}`;
}

// Helper: look up an employee's id + name from their username.
// Used everywhere a screen sends `employee_username` instead of a raw name/id,
// so the backend never has to trust a client-supplied name.
async function getEmployeeByUsername(username) {
  const [rows] = await pool.query(
    `SELECT id, name, username, email, role FROM employees WHERE username = ? LIMIT 1`,
    [username]
  );
  return rows[0] || null;
}

// ---------------------------------------------------------------------------
// EMPLOYEES
// ---------------------------------------------------------------------------
app.get('/employees', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, username, name, email, role, specialization, created_at FROM employees ORDER BY id DESC`
    );
    res.json({ employees: rows });
  } catch (err) {
    console.log('Fetch employees error:', err);
    res.status(500).json({ message: 'Could not fetch employees.' });
  }
});

app.post('/employees', verifyToken, async (req, res) => {
  const { name, email, password, role, specialization } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }
  try {
    const [existing] = await pool.query(`SELECT id FROM employees WHERE email = ?`, [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    const username = await generateUsername(role || 'Employee');
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO employees (username, name, email, password, role, specialization) VALUES (?, ?, ?, ?, ?, ?)`,
      [username, name, email, hashedPassword, role || 'Employee', specialization || null]
    );
    try {
      await sendCredentialsMail({ toEmail: email, toName: name, username, password, role: role || 'Employee' });
    } catch (mailErr) {
      console.log('Mail send failed:', mailErr.message);
    }
    res.status(201).json({
      message: 'Employee account created.',
      employee: { id: result.insertId, username, name, email, role, specialization },
    });
  } catch (err) {
    console.log('Create employee error:', err);
    res.status(500).json({ message: 'Could not create employee account.' });
  }
});

app.put('/employees/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, specialization } = req.body;
  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        `UPDATE employees SET name=?, email=?, password=?, role=?, specialization=? WHERE id=?`,
        [name, email, hashedPassword, role, specialization || null, id]
      );
      const [userRow] = await pool.query(`SELECT username FROM employees WHERE id=?`, [id]);
      const username = userRow[0]?.username;
      try {
        await sendCredentialsMail({ toEmail: email, toName: name, username, password, role });
      } catch (mailErr) {
        console.log('Mail send failed:', mailErr.message);
      }
    } else {
      await pool.query(
        `UPDATE employees SET name=?, email=?, role=?, specialization=? WHERE id=?`,
        [name, email, role, specialization || null, id]
      );
    }
    res.json({ message: 'Employee updated.' });
  } catch (err) {
    console.log('Update employee error:', err);
    res.status(500).json({ message: 'Could not update employee.' });
  }
});

app.delete('/employees/:id', verifyToken, async (req, res) => {
  try {
    await pool.query(`DELETE FROM employees WHERE id=?`, [req.params.id]);
    res.json({ message: 'Employee deleted.' });
  } catch (err) {
    console.log('Delete employee error:', err);
    res.status(500).json({ message: 'Could not delete employee.' });
  }
});

// ---------------------------------------------------------------------------
// LOGIN — unified for Admin + Employees.
// ---------------------------------------------------------------------------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = 'admin@jodtech.com';
  const ADMIN_PASSWORD = 'admin123';

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    let [rows] = await pool.query(`SELECT id FROM employees WHERE email = ?`, [ADMIN_EMAIL]);
    let employeeId = rows[0]?.id;
    if (!employeeId) {
      const username = await generateUsername('MD');
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      const [result] = await pool.query(
        `INSERT INTO employees (username, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
        [username, 'Admin', ADMIN_EMAIL, hashedPassword, 'MD']
      );
      employeeId = result.insertId;
    }
    const token = jwt.sign(
      { id: employeeId, role: 'admin', email: ADMIN_EMAIL },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.json({ token, role: 'admin', name: 'Admin' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, password, role, username FROM employees WHERE LOWER(email) = ?`,
      [normalizedEmail]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const employee = rows[0];
    if (!employee.password) {
      return res.status(401).json({ message: 'This account has no password set. Contact admin.' });
    }
    let passwordMatches = false;
    try {
      passwordMatches = await bcrypt.compare(password, employee.password);
    } catch (compareErr) {
      console.log(`[LOGIN] bcrypt.compare failed for id=${employee.id}:`, compareErr.message);
      return res.status(500).json({ message: 'Account password is stored incorrectly. Recreate this employee account.' });
    }
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = jwt.sign(
      { id: employee.id, role: employee.role, email: employee.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.json({
      token,
      role: employee.role,
      name: employee.name,
      username: employee.username,
    });
  } catch (err) {
    console.log('Login error:', err);
    return res.status(500).json({ message: 'Server error during login.' });
  }
});

// ---------------------------------------------------------------------------
// FOLLOW-UPS
// ---------------------------------------------------------------------------
app.get('/followups', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, client_name, interaction_type, follow_up_date, time_slot, status, notes, created_at
       FROM followups ORDER BY follow_up_date DESC, id DESC`
    );
    res.json({ followups: rows });
  } catch (err) {
    console.log('Fetch followups error:', err);
    res.status(500).json({ message: 'Could not fetch follow-ups.' });
  }
});

app.post('/followups', verifyToken, async (req, res) => {
  const { client_name, interaction_type, follow_up_date, time_slot, status, notes } = req.body;
  if (!client_name || !follow_up_date || !notes) {
    return res.status(400).json({ message: 'Client name, follow-up date and notes are required.' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO followups (client_name, interaction_type, follow_up_date, time_slot, status, notes, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [client_name, interaction_type || 'Call Notes', follow_up_date, time_slot || null, status || 'Scheduled', notes, req.user?.id || null]
    );
    res.status(201).json({ message: 'Follow-up scheduled.', id: result.insertId });
  } catch (err) {
    console.log('Create followup error:', err);
    res.status(500).json({ message: 'Could not schedule follow-up.' });
  }
});

// ---------------------------------------------------------------------------
// TASKS
// ---------------------------------------------------------------------------

// All tasks (admin/manager view)
app.get('/tasks', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.id, t.title, t.description AS subtitle, t.priority, t.status, t.due_date, t.notes,
              t.assigned_to, ae.name AS assigned_to_name,
              t.assigned_by, ab.name AS assigned_by_name,
              t.created_at
       FROM tasks t
       LEFT JOIN employees ae ON ae.id = t.assigned_to
       LEFT JOIN employees ab ON ab.id = t.assigned_by
       ORDER BY t.id DESC`
    );
    res.json({ tasks: rows });
  } catch (err) {
    console.log('Fetch tasks error:', err);
    res.status(500).json({ message: 'Could not fetch tasks.' });
  }
});

// FIX (was 404 — route didn't exist): the logged-in employee's own tasks only.
// Used by DashboardScreen.jsx ("My Assigned Tasks") and MyTasksScreen.jsx (kanban board).
app.get('/tasks/my', verifyToken, async (req, res) => {
  const { employee_username, limit } = req.query;
  if (!employee_username) {
    return res.status(400).json({ message: 'employee_username is required.' });
  }
  try {
    const employee = await getEmployeeByUsername(employee_username);
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });

    let query = `SELECT t.id, t.title, t.description AS subtitle, t.priority, t.status, t.due_date, t.notes,
              t.assigned_to, ae.name AS assigned_to_name,
              t.assigned_by, ab.name AS assigned_by_name,
              t.created_at
       FROM tasks t
       LEFT JOIN employees ae ON ae.id = t.assigned_to
       LEFT JOIN employees ab ON ab.id = t.assigned_by
       WHERE t.assigned_to = ?
       ORDER BY t.id DESC`;
    const params = [employee.id];
    if (limit) {
      query += ` LIMIT ?`;
      params.push(Number(limit));
    }
    const [rows] = await pool.query(query, params);
    res.json({ tasks: rows });
  } catch (err) {
    console.log('Fetch my tasks error:', err);
    res.status(500).json({ message: 'Could not fetch your tasks.' });
  }
});

app.post('/tasks', verifyToken, async (req, res) => {
  const { title, description, assigned_to, priority, status, due_date, notes } = req.body;
  if (!title || !assigned_to) {
    return res.status(400).json({ message: 'Task title and assignee are required.' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO tasks (title, description, assigned_to, assigned_by, priority, status, due_date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description || null, assigned_to, req.user?.id || null, priority || 'Medium', status || 'todo', due_date || null, notes || null]
    );
    res.status(201).json({ message: 'Task assigned.', id: result.insertId });
  } catch (err) {
    console.log('Create task error:', err);
    res.status(500).json({ message: 'Could not assign task.' });
  }
});

// FIX (was 404 — route didn't exist): lets an employee move their own task
// between kanban columns from MyTasksScreen.jsx. Ownership is verified
// server-side (assigned_to must match the requesting employee), so an
// employee can never update someone else's task by guessing an id.
app.put('/tasks/:id/status', verifyToken, async (req, res) => {
  const { status, employee_username } = req.body;
  if (!status || !employee_username) {
    return res.status(400).json({ message: 'status and employee_username are required.' });
  }
  try {
    const employee = await getEmployeeByUsername(employee_username);
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });

    const [taskRows] = await pool.query(`SELECT assigned_to FROM tasks WHERE id = ?`, [req.params.id]);
    if (taskRows.length === 0) return res.status(404).json({ message: 'Task not found.' });
    if (taskRows[0].assigned_to !== employee.id) {
      return res.status(403).json({ message: 'You can only update tasks assigned to you.' });
    }

    await pool.query(`UPDATE tasks SET status = ? WHERE id = ?`, [status, req.params.id]);
    res.json({ message: 'Task status updated.' });
  } catch (err) {
    console.log('Update task status error:', err);
    res.status(500).json({ message: 'Could not update task status.' });
  }
});

// ---------------------------------------------------------------------------
// DASHBOARD — used by DashboardScreen.jsx
// FIX (was 404 — routes didn't exist at all, so the dashboard always showed
// zeros and an empty chart no matter what was in the DB).
// ---------------------------------------------------------------------------
app.get('/dashboard/summary', verifyToken, async (req, res) => {
  const { employee_username } = req.query;
  if (!employee_username) {
    return res.status(400).json({ message: 'employee_username is required.' });
  }
  try {
    const employee = await getEmployeeByUsername(employee_username);
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });

    const [[{ activeProjects }]] = await pool.query(
      `SELECT COUNT(*) AS activeProjects FROM projects WHERE status != 'Completed'`
    );
    const [[{ pendingTasks }]] = await pool.query(
      `SELECT COUNT(*) AS pendingTasks FROM tasks WHERE assigned_to = ? AND status != 'completed'`,
      [employee.id]
    );

    res.json({
      active_projects: activeProjects,
      pending_tasks: pendingTasks,
      active_projects_trend: '',
      pending_tasks_trend: '',
    });
  } catch (err) {
    console.log('Fetch dashboard summary error:', err);
    res.status(500).json({ message: 'Could not fetch dashboard summary.' });
  }
});

app.get('/dashboard/revenue-leads', verifyToken, async (req, res) => {
  try {
    // Sums closed-deal amounts per weekday over the last 6 days.
    const [rows] = await pool.query(
      `SELECT DAYNAME(closed_at) AS day, SUM(amount) AS total
       FROM deals
       WHERE closed_at IS NOT NULL AND closed_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
       GROUP BY DAYNAME(closed_at)`
    );
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const totalsByDay = {};
    rows.forEach((r) => {
      totalsByDay[r.day] = Number(r.total) || 0;
    });
    const points = dayOrder.map((d) => ({ label: d.slice(0, 3), value: totalsByDay[d] || 0 }));
    res.json({ points });
  } catch (err) {
    console.log('Fetch revenue/leads error:', err);
    res.status(500).json({ message: 'Could not fetch revenue/leads data.' });
  }
});

// ---------------------------------------------------------------------------
// WORK UPDATES
// ---------------------------------------------------------------------------
app.get('/work-updates/mine', verifyToken, async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: 'date query param is required.' });
  try {
    const [rows] = await pool.query(
      `SELECT morning, afternoon, evening FROM work_updates WHERE employee_id = ? AND update_date = ?`,
      [req.user.id, date]
    );
    res.json({ update: rows[0] || { morning: '', afternoon: '', evening: '' } });
  } catch (err) {
    console.log('Fetch my work update error:', err);
    res.status(500).json({ message: 'Could not fetch your update.' });
  }
});

app.post('/work-updates', verifyToken, async (req, res) => {
  const { date, morning, afternoon, evening } = req.body;
  if (!date) return res.status(400).json({ message: 'date is required.' });
  try {
    await pool.query(
      `INSERT INTO work_updates (employee_id, update_date, morning, afternoon, evening)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE morning = VALUES(morning), afternoon = VALUES(afternoon), evening = VALUES(evening)`,
      [req.user.id, date, morning || '', afternoon || '', evening || '']
    );
    res.json({ message: 'Work update saved.' });
  } catch (err) {
    console.log('Save work update error:', err);
    res.status(500).json({ message: 'Could not save your update.' });
  }
});

app.get('/work-updates/team', verifyToken, async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: 'date query param is required.' });
  try {
    const [rows] = await pool.query(
      `SELECT e.id, e.name, e.role, e.email,
              w.morning, w.afternoon, w.evening,
              CASE WHEN w.id IS NOT NULL AND (w.morning != '' OR w.afternoon != '' OR w.evening != '')
                   THEN 'Submitted' ELSE 'Not Submitted' END AS status
       FROM employees e
       LEFT JOIN work_updates w ON w.employee_id = e.id AND w.update_date = ?
       ORDER BY e.name ASC`,
      [date]
    );
    res.json({ employees: rows });
  } catch (err) {
    console.log('Fetch team updates error:', err);
    res.status(500).json({ message: 'Could not load team updates.' });
  }
});

// ---------------------------------------------------------------------------
// ATTENDANCE LOGS
// ---------------------------------------------------------------------------

// FIX: now scoped by employee_username when provided (EmployeeAttendanceScreen.jsx
// always sends it), so an employee only sees their own log instead of everyone's.
// Falls back to matching on employee_name too, for older rows that predate the
// employee_id column being populated.
app.get('/attendance', verifyToken, async (req, res) => {
  const { employee_username } = req.query;
  try {
    if (employee_username) {
      const employee = await getEmployeeByUsername(employee_username);
      if (!employee) return res.status(404).json({ message: 'Employee not found.' });

      const [rows] = await pool.query(
        `SELECT id, employee_name AS employee, log_date AS date, check_in AS checkIn,
                check_out AS checkOut, type, status
         FROM attendance_logs
         WHERE employee_id = ? OR employee_name = ?
         ORDER BY log_date DESC, id DESC`,
        [employee.id, employee.name]
      );
      return res.json({ logs: rows });
    }

    const [rows] = await pool.query(
      `SELECT id, employee_name AS employee, log_date AS date, check_in AS checkIn,
              check_out AS checkOut, type, status
       FROM attendance_logs ORDER BY log_date DESC, id DESC`
    );
    res.json({ logs: rows });
  } catch (err) {
    console.log('Fetch attendance error:', err);
    res.status(500).json({ message: 'Could not fetch attendance logs.' });
  }
});

// Manual log entry (Log Employee Attendance modal — admin)
app.post('/attendance', verifyToken, async (req, res) => {
  const { employee_name, employee_id, log_date, check_in, check_out, type, status } = req.body;
  if (!employee_name || !log_date) {
    return res.status(400).json({ message: 'Employee name and date are required.' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO attendance_logs (employee_name, employee_id, log_date, check_in, check_out, type, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE check_in = VALUES(check_in), check_out = VALUES(check_out),
                               type = VALUES(type), status = VALUES(status)`,
      [employee_name, employee_id || null, log_date, check_in || null, check_out || null, type || 'Office', status || 'Present']
    );
    res.status(201).json({ message: 'Attendance logged.', id: result.insertId });
  } catch (err) {
    console.log('Create attendance error:', err);
    res.status(500).json({ message: 'Could not log attendance.' });
  }
});

// FIX: was expecting `employee_name` in the body — EmployeeAttendanceScreen.jsx
// sends `employee_username`, which came through as undefined and always failed
// with "employee_name is required." Now resolves username -> employee first.
app.post('/attendance/check-in', verifyToken, async (req, res) => {
  const { employee_username } = req.body;
  if (!employee_username) return res.status(400).json({ message: 'employee_username is required.' });

  try {
    const employee = await getEmployeeByUsername(employee_username);
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });

    const now = new Date();
    const checkInTime = now.toTimeString().slice(0, 5);
    const today = now.toISOString().slice(0, 10);
    const WORK_DAY_START_MINUTES = 10 * 60;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const status = nowMinutes > WORK_DAY_START_MINUTES ? 'Late' : 'Present';

    const [existing] = await pool.query(
      `SELECT id, check_in FROM attendance_logs WHERE (employee_id = ? OR employee_name = ?) AND log_date = ?`,
      [employee.id, employee.name, today]
    );

    if (existing.length > 0 && existing[0].check_in) {
      return res.status(409).json({ message: `Already checked in today at ${existing[0].check_in}.` });
    }

    if (existing.length > 0) {
      await pool.query(`UPDATE attendance_logs SET check_in = ?, status = ? WHERE id = ?`, [checkInTime, status, existing[0].id]);
    } else {
      await pool.query(
        `INSERT INTO attendance_logs (employee_name, employee_id, log_date, check_in, type, status) VALUES (?, ?, ?, ?, 'Office', ?)`,
        [employee.name, employee.id, today, checkInTime, status]
      );
    }

    res.json({ message: `Checked in at ${checkInTime}.`, checkIn: checkInTime, status });
  } catch (err) {
    console.log('Check-in error:', err);
    res.status(500).json({ message: 'Could not check in.' });
  }
});

// Face Check-In — accepts a base64 photo captured from the camera.
// Face Check-In — verifies the freshly captured photo against the employee's
// enrolled face hash (set by admin via /employees/enroll-face) before logging
// attendance. Only proceeds if similarity is within FACE_MATCH_MAX_DISTANCE.
app.post('/attendance/face-checkin', verifyToken, async (req, res) => {
  const { employee_name, face_image } = req.body;
  if (!employee_name) return res.status(400).json({ message: 'employee_name is required.' });
  if (!face_image) return res.status(400).json({ message: 'face_image is required.' });

  try {
    const employee = await getEmployeeByName(employee_name);
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });

    const [enrolled] = await pool.query(
      `SELECT face_hash FROM face_enrollments WHERE employee_name = ? LIMIT 1`,
      [employee_name]
    );
    if (enrolled.length === 0) {
      return res.status(404).json({ message: 'This employee is not enrolled for face check-in. Please ask admin to enroll your face first.' });
    }

    const buffer = Buffer.from(face_image, 'base64');
    const capturedHash = await computeImageHash(buffer);
    const distance = hammingDistanceHex(enrolled[0].face_hash, capturedHash);

    if (distance > FACE_MATCH_MAX_DISTANCE) {
      return res.status(401).json({
        message: 'Face does not match the enrolled photo. Please retake in similar lighting/framing, or ask admin to re-enroll.',
      });
    }

    const now = new Date();
    const checkInTime = now.toTimeString().slice(0, 5);
    const today = now.toISOString().slice(0, 10);
    const WORK_DAY_START_MINUTES = 10 * 60;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const status = nowMinutes > WORK_DAY_START_MINUTES ? 'Late' : 'Present';

    const [existing] = await pool.query(
      `SELECT id, check_in FROM attendance_logs WHERE (employee_id = ? OR employee_name = ?) AND log_date = ?`,
      [employee.id, employee.name, today]
    );

    if (existing.length > 0 && existing[0].check_in) {
      return res.status(409).json({ message: `Already checked in today at ${existing[0].check_in}.` });
    }

    if (existing.length > 0) {
      await pool.query(
        `UPDATE attendance_logs SET check_in = ?, status = ?, checkin_photo = ? WHERE id = ?`,
        [checkInTime, status, face_image, existing[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO attendance_logs (employee_name, employee_id, log_date, check_in, type, status, checkin_photo)
         VALUES (?, ?, ?, ?, 'Office', ?, ?)`,
        [employee.name, employee.id, today, checkInTime, status, face_image]
      );
    }

    return res.status(200).json({
      message: `${employee.name} checked in via face recognition at ${checkInTime}.`,
      checkIn: checkInTime,
      status,
    });
  } catch (err) {
    console.error('Face check-in error:', err);
    return res.status(500).json({ message: 'Server error during face check-in.' });
  }
});

// FIX: same employee_name -> employee_username mismatch as check-in.
app.post('/attendance/check-out', verifyToken, async (req, res) => {
  const { employee_username } = req.body;
  if (!employee_username) return res.status(400).json({ message: 'employee_username is required.' });

  try {
    const employee = await getEmployeeByUsername(employee_username);
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });

    const now = new Date();
    const checkOutTime = now.toTimeString().slice(0, 5);
    const today = now.toISOString().slice(0, 10);

    const [existing] = await pool.query(
      `SELECT id, check_in, check_out FROM attendance_logs WHERE (employee_id = ? OR employee_name = ?) AND log_date = ?`,
      [employee.id, employee.name, today]
    );

    if (existing.length === 0 || !existing[0].check_in) {
      return res.status(400).json({ message: 'Please check in first before checking out.' });
    }
    if (existing[0].check_out) {
      return res.status(409).json({ message: `Already checked out today at ${existing[0].check_out}.` });
    }

    await pool.query(`UPDATE attendance_logs SET check_out = ? WHERE id = ?`, [checkOutTime, existing[0].id]);
    res.json({ message: `Checked out at ${checkOutTime}.`, checkOut: checkOutTime });
  } catch (err) {
    console.log('Check-out error:', err);
    res.status(500).json({ message: 'Could not check out.' });
  }
});

// ---------------------------------------------------------------------------
// FINGERPRINT ENROLLMENT + CHECK-IN
//
// Run this once against your DB before using these two routes:
//
//   CREATE TABLE IF NOT EXISTS fingerprint_enrollments (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     employee_username VARCHAR(100) NOT NULL UNIQUE,
//     device_platform VARCHAR(50) DEFAULT NULL,
//     enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (employee_username) REFERENCES employees(username)
//   );
//
// (needs employees.username to be UNIQUE — ALTER TABLE employees ADD UNIQUE (username);
// if it isn't already, or drop the FK line.)
// ---------------------------------------------------------------------------
app.post('/employees/enroll-fingerprint', verifyToken, async (req, res) => {
  const { employee_username, device_platform } = req.body;
  if (!employee_username) {
    return res.status(400).json({ message: 'employee_username is required.' });
  }
  try {
    const employee = await getEmployeeByUsername(employee_username);
    if (!employee) return res.status(404).json({ message: 'No employee found with that username.' });

    await pool.query(
      `INSERT INTO fingerprint_enrollments (employee_username, device_platform)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE device_platform = VALUES(device_platform), enrolled_at = CURRENT_TIMESTAMP`,
      [employee_username, device_platform || null]
    );
    return res.status(200).json({ message: `${employee.name} enrolled successfully for fingerprint check-in.` });
  } catch (err) {
    console.error('Enroll fingerprint error:', err);
    return res.status(500).json({ message: 'Server error while enrolling fingerprint.' });
  }
});

app.post('/attendance/fingerprint-checkin', verifyToken, async (req, res) => {
  const { employee_username, verified } = req.body;
  if (!employee_username || !verified) {
    return res.status(400).json({ message: 'employee_username and a successful scan are required.' });
  }
  try {
    const [enrolled] = await pool.query(
      `SELECT e.id AS employee_id, e.name AS employee_name
       FROM fingerprint_enrollments f
       JOIN employees e ON e.username = f.employee_username
       WHERE f.employee_username = ? LIMIT 1`,
      [employee_username]
    );
    if (enrolled.length === 0) {
      return res.status(404).json({ message: 'This employee is not enrolled for fingerprint check-in.' });
    }
    const { employee_id, employee_name } = enrolled[0];

    const now = new Date();
    const checkInTime = now.toTimeString().slice(0, 5);
    const today = now.toISOString().slice(0, 10);
    const WORK_DAY_START_MINUTES = 10 * 60;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const status = nowMinutes > WORK_DAY_START_MINUTES ? 'Late' : 'Present';

    const [existing] = await pool.query(
      `SELECT id, check_in FROM attendance_logs WHERE employee_name = ? AND log_date = ?`,
      [employee_name, today]
    );

    if (existing.length > 0 && existing[0].check_in) {
      return res.status(409).json({ message: `${employee_name} already checked in today at ${existing[0].check_in}.` });
    }

    if (existing.length > 0) {
      await pool.query(`UPDATE attendance_logs SET check_in = ?, status = ? WHERE id = ?`, [checkInTime, status, existing[0].id]);
    } else {
      await pool.query(
        `INSERT INTO attendance_logs (employee_name, employee_id, log_date, check_in, type, status)
         VALUES (?, ?, ?, ?, 'Office', ?)`,
        [employee_name, employee_id, today, checkInTime, status]
      );
    }

    return res.status(200).json({ message: `${employee_name} checked in via fingerprint at ${checkInTime}.`, checkIn: checkInTime, status });
  } catch (err) {
    console.error('Fingerprint check-in error:', err);
    return res.status(500).json({ message: 'Server error during fingerprint check-in.' });
  }
});

// ---------------------------------------------------------------------------
// LEAVE REQUESTS
//
// Run this once if the column doesn't exist yet — needed so a leave request
// can be scoped back to the employee who submitted it:
//   ALTER TABLE leave_requests ADD COLUMN employee_username VARCHAR(100) NULL;
// ---------------------------------------------------------------------------

// FIX: now scoped by employee_username when provided (My Leave Requests panel),
// and no longer hardcoded to status='Pending' — Approved/Rejected requests
// were invisible to the employee before.
app.get('/leave-requests', verifyToken, async (req, res) => {
  const { employee_username } = req.query;
  try {
    if (employee_username) {
      const [rows] = await pool.query(
        `SELECT id, employee_name AS name, department, leave_type AS leaveType,
                start_date AS startDate, end_date AS endDate, reason, status
         FROM leave_requests WHERE employee_username = ? ORDER BY id DESC`,
        [employee_username]
      );
      return res.json({ requests: rows });
    }

    const [rows] = await pool.query(
      `SELECT id, employee_name AS name, department, leave_type AS leaveType,
              start_date AS startDate, end_date AS endDate, reason, status
       FROM leave_requests ORDER BY id DESC`
    );
    res.json({ requests: rows });
  } catch (err) {
    console.log('Fetch leave requests error:', err);
    res.status(500).json({ message: 'Could not fetch leave requests.' });
  }
});

// FIX: was expecting `employee_name` — ApplyLeaveModal sends `employee_username`,
// so the name field always came through empty and the 400 validation blocked
// every submission. Now resolves the username to a name server-side.
app.post('/leave-requests', verifyToken, async (req, res) => {
  const { employee_username, leave_type, start_date, end_date, reason } = req.body;
  if (!employee_username || !start_date || !end_date || !reason) {
    return res.status(400).json({ message: 'employee_username, dates and reason are required.' });
  }
  try {
    const employee = await getEmployeeByUsername(employee_username);
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });

    const [result] = await pool.query(
      `INSERT INTO leave_requests (employee_name, employee_username, department, leave_type, start_date, end_date, reason, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [employee.name, employee_username, employee.role || null, leave_type || 'Sick Leave', start_date, end_date, reason]
    );
    res.status(201).json({ message: 'Leave request submitted.', id: result.insertId });
  } catch (err) {
    console.log('Create leave request error:', err);
    res.status(500).json({ message: 'Could not submit leave request.' });
  }
});

app.put('/leave-requests/:id', verifyToken, async (req, res) => {
  const { status } = req.body;
  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: "status must be 'Approved' or 'Rejected'." });
  }
  try {
    await pool.query(`UPDATE leave_requests SET status = ? WHERE id = ?`, [status, req.params.id]);
    res.json({ message: `Leave request ${status.toLowerCase()}.` });
  } catch (err) {
    console.log('Update leave request error:', err);
    res.status(500).json({ message: 'Could not update leave request.' });
  }
});

// ---------------------------------------------------------------------------
// CLIENTS
// ---------------------------------------------------------------------------
app.get('/clients', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM clients ORDER BY id DESC`);
    res.json({ clients: rows });
  } catch (err) {
    console.log('Fetch clients error:', err);
    res.status(500).json({ message: 'Could not fetch clients.' });
  }
});

app.post('/clients', verifyToken, async (req, res) => {
  const {
    name, company, email, phone, address, notes,
    implementation_phase, delivery_status, order_description, changes_requested,
  } = req.body;
  if (!name) return res.status(400).json({ message: 'Client name is required.' });
  if (!email) return res.status(400).json({ message: 'Email address is required.' });
  try {
    const [result] = await pool.query(
      `INSERT INTO clients
        (name, company, email, phone, address, notes,
         implementation_phase, delivery_status, order_description, changes_requested)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, company || null, email || null, phone || null, address || null, notes || null,
       implementation_phase || 'Planning', delivery_status || 'Pending', order_description || null, changes_requested || null]
    );
    res.status(201).json({ message: 'Client added.', id: result.insertId });
  } catch (err) {
    console.log('Create client error:', err);
    res.status(500).json({ message: 'Could not add client.' });
  }
});

app.put('/clients/:id', verifyToken, async (req, res) => {
  const {
    name, company, email, phone, address, notes,
    implementation_phase, delivery_status, order_description, changes_requested,
  } = req.body;
  if (!name) return res.status(400).json({ message: 'Client name is required.' });
  if (!email) return res.status(400).json({ message: 'Email address is required.' });
  try {
    await pool.query(
      `UPDATE clients SET
        name=?, company=?, email=?, phone=?, address=?, notes=?,
        implementation_phase=?, delivery_status=?, order_description=?, changes_requested=?
       WHERE id=?`,
      [name, company || null, email || null, phone || null, address || null, notes || null,
       implementation_phase || 'Planning', delivery_status || 'Pending', order_description || null, changes_requested || null, req.params.id]
    );
    res.json({ message: 'Client updated.' });
  } catch (err) {
    console.log('Update client error:', err);
    res.status(500).json({ message: 'Could not update client.' });
  }
});

app.delete('/clients/:id', verifyToken, async (req, res) => {
  try {
    await pool.query(`DELETE FROM clients WHERE id=?`, [req.params.id]);
    res.json({ message: 'Client deleted.' });
  } catch (err) {
    console.log('Delete client error:', err);
    res.status(500).json({ message: 'Could not delete client.' });
  }
});

// ---------------------------------------------------------------------------
// LEADS
// ---------------------------------------------------------------------------
app.get('/leads', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.*, e.name AS assigned_to_name
       FROM leads l
       LEFT JOIN employees e ON e.id = l.assigned_to
       ORDER BY l.id DESC`
    );
    res.json({ leads: rows });
  } catch (err) {
    console.log('Fetch leads error:', err);
    res.status(500).json({ message: 'Could not fetch leads.' });
  }
});

app.post('/leads', verifyToken, async (req, res) => {
  const { full_name, company_name, email, phone, address, source, status, notes, assigned_to } = req.body;
  if (!full_name || !email) {
    return res.status(400).json({ message: 'Full name and email are required.' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO leads (full_name, company_name, email, phone, address, source, status, notes, assigned_to)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [full_name, company_name || null, email, phone || null, address || null, source || 'Organic Search', status || 'New', notes || null, assigned_to || null]
    );
    res.status(201).json({ message: 'Lead added.', id: result.insertId });
  } catch (err) {
    console.log('Create lead error:', err);
    res.status(500).json({ message: 'Could not add lead.' });
  }
});

app.put('/leads/:id', verifyToken, async (req, res) => {
  const { full_name, company_name, email, phone, address, source, status, notes, assigned_to } = req.body;
  try {
    await pool.query(
      `UPDATE leads SET full_name=?, company_name=?, email=?, phone=?, address=?, source=?, status=?, notes=?, assigned_to=? WHERE id=?`,
      [full_name, company_name || null, email, phone || null, address || null, source, status, notes || null, assigned_to || null, req.params.id]
    );
    res.json({ message: 'Lead updated.' });
  } catch (err) {
    console.log('Update lead error:', err);
    res.status(500).json({ message: 'Could not update lead.' });
  }
});

app.delete('/leads/:id', verifyToken, async (req, res) => {
  try {
    await pool.query(`DELETE FROM leads WHERE id=?`, [req.params.id]);
    res.json({ message: 'Lead deleted.' });
  } catch (err) {
    console.log('Delete lead error:', err);
    res.status(500).json({ message: 'Could not delete lead.' });
  }
});

// ---------------------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------------------
app.get('/projects', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS client_name
       FROM projects p
       LEFT JOIN clients c ON c.id = p.client_id
       ORDER BY p.id DESC`
    );
    res.json({ projects: rows });
  } catch (err) {
    console.log('Fetch projects error:', err);
    res.status(500).json({ message: 'Could not fetch projects.' });
  }
});

app.post('/projects', verifyToken, async (req, res) => {
  const { project_name, description, link_url, status, client_id } = req.body;
  if (!project_name) return res.status(400).json({ message: 'Project name is required.' });
  try {
    const [result] = await pool.query(
      `INSERT INTO projects (project_name, description, link_url, status, client_id) VALUES (?, ?, ?, ?, ?)`,
      [project_name, description || null, link_url || null, status || 'In Progress', client_id || null]
    );
    res.status(201).json({ message: 'Project created.', id: result.insertId });
  } catch (err) {
    console.log('Create project error:', err);
    res.status(500).json({ message: 'Could not create project.' });
  }
});

app.put('/projects/:id', verifyToken, async (req, res) => {
  const { project_name, description, link_url, status, client_id } = req.body;
  try {
    await pool.query(
      `UPDATE projects SET project_name=?, description=?, link_url=?, status=?, client_id=? WHERE id=?`,
      [project_name, description || null, link_url || null, status, client_id || null, req.params.id]
    );
    res.json({ message: 'Project updated.' });
  } catch (err) {
    console.log('Update project error:', err);
    res.status(500).json({ message: 'Could not update project.' });
  }
});

app.delete('/projects/:id', verifyToken, async (req, res) => {
  try {
    await pool.query(`DELETE FROM projects WHERE id=?`, [req.params.id]);
    res.json({ message: 'Project deleted.' });
  } catch (err) {
    console.log('Delete project error:', err);
    res.status(500).json({ message: 'Could not delete project.' });
  }
});

// ---------------------------------------------------------------------------
// DEALS (Sales Pipeline)
// ---------------------------------------------------------------------------
app.get('/deals', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT d.*, e.name AS assigned_to_name
       FROM deals d
       LEFT JOIN employees e ON e.id = d.assigned_to
       ORDER BY d.id DESC`
    );
    res.json({ deals: rows });
  } catch (err) {
    console.log('Fetch deals error:', err);
    res.status(500).json({ message: 'Could not fetch deals.' });
  }
});

app.post('/deals', verifyToken, async (req, res) => {
  const { client_name, lead_id, client_id, amount, stage, probability, assigned_to, closed_at } = req.body;
  if (!client_name || amount === undefined) {
    return res.status(400).json({ message: 'Client name and amount are required.' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO deals (client_name, lead_id, client_id, amount, stage, probability, assigned_to, closed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [client_name, lead_id || null, client_id || null, amount, stage || 'Negotiation', probability ?? 50, assigned_to || null, closed_at || null]
    );
    res.status(201).json({ message: 'Deal added.', id: result.insertId });
  } catch (err) {
    console.log('Create deal error:', err);
    res.status(500).json({ message: 'Could not add deal.' });
  }
});

app.put('/deals/:id', verifyToken, async (req, res) => {
  const { client_name, lead_id, client_id, amount, stage, probability, assigned_to, closed_at } = req.body;
  try {
    await pool.query(
      `UPDATE deals SET client_name=?, lead_id=?, client_id=?, amount=?, stage=?, probability=?, assigned_to=?, closed_at=? WHERE id=?`,
      [client_name, lead_id || null, client_id || null, amount, stage, probability ?? 50, assigned_to || null, closed_at || null, req.params.id]
    );
    res.json({ message: 'Deal updated.' });
  } catch (err) {
    console.log('Update deal error:', err);
    res.status(500).json({ message: 'Could not update deal.' });
  }
});

app.delete('/deals/:id', verifyToken, async (req, res) => {
  try {
    await pool.query(`DELETE FROM deals WHERE id=?`, [req.params.id]);
    res.json({ message: 'Deal deleted.' });
  } catch (err) {
    console.log('Delete deal error:', err);
    res.status(500).json({ message: 'Could not delete deal.' });
  }
});

// ---------------------------------------------------------------------------
// COMPANY SETTINGS (single row, id = 1)
// ---------------------------------------------------------------------------
app.get('/settings/company', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM company_settings WHERE id = 1`);
    res.json({ settings: rows[0] || null });
  } catch (err) {
    console.log('Fetch company settings error:', err);
    res.status(500).json({ message: 'Could not fetch company settings.' });
  }
});

app.put('/settings/company', verifyToken, async (req, res) => {
  const { logo_url, company_name, industry, phone, email, website, tax_id, currency, timezone, address } = req.body;
  try {
    await pool.query(
      `UPDATE company_settings
       SET logo_url=?, company_name=?, industry=?, phone=?, email=?, website=?, tax_id=?, currency=?, timezone=?, address=?
       WHERE id = 1`,
      [logo_url || null, company_name || null, industry || null, phone || null, email || null, website || null, tax_id || null, currency || null, timezone || null, address || null]
    );
    res.json({ message: 'Company settings updated.' });
  } catch (err) {
    console.log('Update company settings error:', err);
    res.status(500).json({ message: 'Could not update company settings.' });
  }
});

// ---------------------------------------------------------------------------
// NOTIFICATION SETTINGS (per user_key — upsert)
// ---------------------------------------------------------------------------
app.get('/settings/notifications', verifyToken, async (req, res) => {
  const userKey = req.user.role === 'admin' ? 'admin' : String(req.user.id);
  try {
    const [rows] = await pool.query(`SELECT * FROM notification_settings WHERE user_key = ?`, [userKey]);
    res.json({
      settings: rows[0] || {
        user_key: userKey,
        email_notifications: true,
        push_notifications: false,
        lead_assignments: true,
        task_deadlines: true,
      },
    });
  } catch (err) {
    console.log('Fetch notification settings error:', err);
    res.status(500).json({ message: 'Could not fetch notification settings.' });
  }
});

app.put('/settings/notifications', verifyToken, async (req, res) => {
  const userKey = req.user.role === 'admin' ? 'admin' : String(req.user.id);
  const { email_notifications, push_notifications, lead_assignments, task_deadlines } = req.body;
  try {
    await pool.query(
      `INSERT INTO notification_settings (user_key, email_notifications, push_notifications, lead_assignments, task_deadlines)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         email_notifications = VALUES(email_notifications),
         push_notifications = VALUES(push_notifications),
         lead_assignments = VALUES(lead_assignments),
         task_deadlines = VALUES(task_deadlines)`,
      [userKey, !!email_notifications, !!push_notifications, !!lead_assignments, !!task_deadlines]
    );
    res.json({ message: 'Notification settings saved.' });
  } catch (err) {
    console.log('Update notification settings error:', err);
    res.status(500).json({ message: 'Could not save notification settings.' });
  }
});

// ---------------------------------------------------------------------------
// FACE ENROLLMENT + CHECK-IN
// ---------------------------------------------------------------------------

// Enroll — stores a compact similarity hash of the employee's face photo,
// looked up server-side from the employees table (never trusts a client name).
// Face Check-In — verifies the freshly captured photo against the employee's
// enrolled face hash (set by admin via /employees/enroll-face) before logging
// attendance. Only proceeds if similarity is within FACE_MATCH_MAX_DISTANCE;
// otherwise returns 401 and does NOT touch attendance.

// Enroll — computes a compact similarity hash of the employee's face photo
// and stores it in face_enrollments, keyed by employee_name (looked up
// server-side from the employees table, never trusted from the client).
app.post('/employees/enroll-face', verifyToken, async (req, res) => {
  const { employee_name, face_image, device_platform } = req.body;
  if (!employee_name) {
    return res.status(400).json({ message: 'employee_name is required.' });
  }
  if (!face_image) {
    return res.status(400).json({ message: 'face_image is required.' });
  }

  try {
    const employee = await getEmployeeByName(employee_name);
    if (!employee) {
      return res.status(404).json({ message: 'No employee found with that name.' });
    }

    const buffer = Buffer.from(face_image, 'base64');
    const faceHash = await computeImageHash(buffer);

    await pool.query(
      `INSERT INTO face_enrollments (employee_name, face_hash, device_platform)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE face_hash = VALUES(face_hash), device_platform = VALUES(device_platform), enrolled_at = CURRENT_TIMESTAMP`,
      [employee_name, faceHash, device_platform || null]
    );

    return res.status(200).json({ message: `${employee.name} enrolled successfully for face check-in.` });
  } catch (err) {
    console.error('Enroll face error:', err);
    return res.status(500).json({ message: 'Server error while enrolling face.' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});