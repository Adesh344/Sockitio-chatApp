const User = require("../models/user");
const Group = require("../models/group");

exports.getprivatechat = async (req, res) => {
  const { name } = req.params;

  // Check if the user is logged in
  if (!req.session.User) {
    res.redirect('/login');
    return;
  }

  // Check if the selected user exists
  const selectedUser = await User.findOne({ name });

  if (!selectedUser) {
    res.status(404).send('User not found');
    return;
  }

  res.render('privateChat', { user: req.session.User, recipient: name });
};

exports.getgroupchat = async (req, res) => {
  const user = req.session.User;
  console.log(user);

  const groupName = req.params.groupName;
  res.render('groupchat', { user, groupName });
};

exports.postcreateGroup = async (req, res) => {
  try {
    const { groupName, 'members[]':members } = req.body;
    console.log("Request Body:", req.body);
    console.log("Server",members);
    const memberObjects = await User.find({ _id: { $in: members } });
     console.log("Servermo",memberObjects);
    const newGroup = new Group({
      groupname: groupName,
      members: memberObjects.map(member => member._id),
    });

    await newGroup.save();

    res.status(200).json({ groupId: newGroup._id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
