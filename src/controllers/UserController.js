module.exports = {
  index: (req, res) => {
    res.json({
      message: "Success",
      data: [
        { id: 1, name: "Brother Oengen" },
        { id: 2, name: "Express Developer" },
      ],
    });
  },
};
