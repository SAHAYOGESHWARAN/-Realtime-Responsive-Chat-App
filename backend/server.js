const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const { Server } = require('socket.io');
const http = require('http');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { googleAuth } = require('./middlewares/authMiddleware');
app.use('/uploads', express.static('uploads'));

 const cors = require('cors');
 app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(passport.initialize());
googleAuth(passport);

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on('message', ({ roomId, message }) => {
    io.to(roomId).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

io.on('connection', (socket) => {
    socket.on('typing', ({ roomId, userId }) => {
      socket.to(roomId).emit('displayTyping', { userId });
    });
  
    socket.on('stopTyping', ({ roomId }) => {
      socket.to(roomId).emit('hideTyping');
    });
  
    socket.on('message', ({ roomId, userId, content }) => {
      io.to(roomId).emit('message', { userId, content });
    });
  
    socket.on('joinRoom', ({ roomId }) => {
      socket.join(roomId);
    });
  });
  

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
