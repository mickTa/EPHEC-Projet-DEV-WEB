const { RoleRequest } = require("../models/roleRequest");
const User = require("../models/user");


exports.getAll = async (req, res) => {

  try {
    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }

    const requests = await RoleRequest.findAll({
      order: [["createdAt", "DESC"]], // Newest first
    });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching role requests:", error);
    res.status(500).json({
      error: "Failed to retrieve requests",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


exports.acceptRequest = async (req, res) => {

    try {

      const { requestId } = req.body;

      if (!req.user) {
        return res.status(404).json({ error: "User not found" });
      }
    
      const request = await RoleRequest.findByPk(requestId);
      await request.update({ status: "ACCEPTED", adminUserId: req.user.id });

      const user = await User.findByPk(request.userId);
      await user.update({ role: "ORGANIZER" });
    
      res.status(200);

    } catch (error) {
      console.error("Error accepting the request:", error);
      res.status(500).json({
        error: "Failed to accept the request",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }

}

exports.rejectRequest = async (req, res) => {

    try {

      const { requestId } = req.body;

      if (!req.user) {
        return res.status(404).json({ error: "User not found" });
      }
    
      const request = await RoleRequest.findByPk(requestId);
      await request.update({ status: "REJECTED", adminUserId: req.user.id });
    
      res.status(200);

    } catch (error) {
      console.error("Error rejecting the request:", error);
      res.status(500).json({
        error: "Failed to reject the request",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }

}