import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ContactPage = () => {
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!issue.trim() || !description.trim()) {
      setMessage({ type: 'error', text: 'Please fill all required fields.' });
      return;
    }

    const formData = new FormData();
    formData.append('issue', issue);
    formData.append('description', description);
    if (screenshot) formData.append('screenshot', screenshot);

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to send message');

      setMessage({ type: 'success', text: 'Message sent successfully!' });
      setIssue('');
      setDescription('');
      setScreenshot(null);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error sending message. Try again later.' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center p-6">
    <motion.div
      className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md"
      variants={fadeIn}
      initial="initial"
      animate="animate"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Facing any issue?</h2>
      <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
        <div>
          <label htmlFor="issue" className="block font-medium mb-1">
            Issue Summary <span className="text-red-500">*</span>
          </label>
          <input
            id="issue"
            type="text"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Problem Statement <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>

        <div>
          <label htmlFor="screenshot" className="block font-medium mb-1">
            Upload Screenshot <span className="text-red-500">*</span>
          </label>
          <input
            id="screenshot"
            type="file"
            accept="image/*"
            onChange={(e) => setScreenshot(e.target.files[0])}
            className="w-full"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
          whileHover={!loading ? { scale: 1.05 } : {}}
          whileTap={!loading ? { scale: 0.95 } : {}}
          aria-label="Submit contact form"
        >
          <FiSend size={20} />
          {loading ? 'Sending...' : 'Submit'}
        </motion.button>
      </form>

      {message && (
        <motion.p
          className={`mt-5 text-center ${
            message.type === 'error' ? 'text-red-600' : 'text-green-600'
          } font-medium`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {message.text}
        </motion.p>
      )}

      <motion.div className="mt-8 text-center space-y-3 text-gray-700">
        <p className="font-semibold">Connect with me:</p>
        <div className="flex justify-center gap-6 text-2xl">
          <a
            href="https://twitter.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="text-blue-500 hover:text-blue-700 transition"
          >
            <FiTwitter />
          </a>
          <a
            href="https://linkedin.com/in/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-blue-700 hover:text-blue-900 transition"
          >
            <FiLinkedin />
          </a>
          <a
  href="mailto:gofuture440@gmail.com"
  aria-label="Email"
  className="text-red-600 hover:text-red-800 transition flex items-center gap-1"
>
  <FiMail />
  <span className="text-sm">gofuture440@gmail.com</span>
</a>
        </div>
      </motion.div>
    </motion.div>
    </div>
  );
};

export default ContactPage;
