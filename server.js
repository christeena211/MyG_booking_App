const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create (Book)
app.post('/api/book', async (req, res) => {
  const { name, email, date, time, service } = req.body;
  if (!name || !email || !date || !time || !service) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    await db.execute(
      'INSERT INTO bookings (name, email, date, time, service) VALUES (?, ?, ?, ?, ?)',
      [name, email, date, time, service]
    );
    res.json({ success: true, message: 'Appointment booked' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Booking failed' });
  }
});

// Read (All bookings)
app.get('/api/bookings', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM bookings ORDER BY date ASC');
  res.json(rows);
});

// Update
app.put('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, date, time, service } = req.body;
  try {
    await db.execute(
      'UPDATE bookings SET name=?, email=?, date=?, time=?, service=? WHERE id=?',
      [name, email, date, time, service, id]
    );
    res.json({ success: true, message: 'Updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});


// Delete
app.delete('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM bookings WHERE id = ?', [id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Deletion failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
