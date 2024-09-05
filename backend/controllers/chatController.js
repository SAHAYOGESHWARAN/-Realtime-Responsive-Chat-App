const Chat = require('../models/Chat');

exports.getMessages = async (req, res) => {
  const { roomId } = req.params;
  try {
    const chat = await Chat.findOne({ roomId });
    if (!chat) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json(chat.messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
};

exports.sendMessage = async (req, res) => {
  const { roomId } = req.body;
  const { sender, content } = req.body;

  try {
    let chat = await Chat.findOne({ roomId });
    if (!chat) {
      chat = new Chat({ roomId, messages: [] });
    }

    chat.messages.push({ sender, content });
    await chat.save();
    res.status(200).json({ message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
};
