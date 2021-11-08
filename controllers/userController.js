const bcrypt = require("bcryptjs");
const fs = require("fs");
const { join } = require("path");
const xlsx = require("read-excel-file/node");
const User = require("../models/users");
const ErrorLogs = require("../models/errorLogs");
const { createUserService } = require("../services/userService");
const { serializeUser } = require("../utils/Auth");
let {
  validate,
  mapBatchId,
  mapCollegeId,
  mapCourseId,
  mapGenderId,
  mapRoleId,
  mapStreamId,
  UUID,
} = require("../utils/helper");
//? To register the User
const createUser = async (req, res) => {
  let userDetails = req.body;
  try {
    let reponse = await createUserService(userDetails);
    return res.status(reponse.code).json(reponse);
  } catch(err) {
    //! Error in creating user
    return res.status(err.code).send(err.message);
  }
};
const getUser = async (req, res) => {
  try {
    let user = await User.findOne({
      regno: req.params.id,
      deleted_at: null,
    }).populate([
      {
        path: "role_id",
        model: "role",
        select: "name",
      },
      {
        path: "gender_id",
        model: "gender",
        select: "name",
      },
      {
        path: "stream_id",
        model: "stream",
        select: "name",
      },
      {
        path: "course_id",
        model: "course",
        select: "name",
      },
      {
        path: "college_id",
        model: "college",
        select: "name",
      },
      {
        path: "batch_id",
        model: "batch",
        select: "start_year end_year",
      },
    ]);
    //! User not found
    if (!user || user.deleted_at)
      return res.status(404).json({
        message: `user not found`,
        success: false,
      });
    let userDetails = serializeUser(user);
    //! Student cannot access admin data
    if (req.user.role === "student" && userDetails.role_id === "admin")
      return res.status(401).json({
        message: `Unauthorized access`,
        success: false,
      });
    res.status(200).json({
      userDetails,
      message: "New User Created",
      success: true,
    });
  } catch (err) {
    //! Error in finding user details
    console.log(err);
    res.status(500).json({
      message: `unable to find user details`,
      success: false,
    });
  }
};
const updateUser = async (req, res) => {
  let updateDetails = req.body;
  try {
    let user = await User.findById(updateDetails._id).populate([
      {
        path: "role_id",
        model: "role",
        select: "name",
      },
      {
        path: "gender_id",
        model: "gender",
        select: "name",
      },
      {
        path: "stream_id",
        model: "stream",
        select: "name",
      },
      {
        path: "course_id",
        model: "course",
        select: "name",
      },
      {
        path: "college_id",
        model: "college",
        select: "name",
      },
      {
        path: "batch_id",
        model: "batch",
        select: "start_year end_year",
      },
    ]);
    //! User not found
    if (!user || user.deleted_at)
      return res.status(404).json({
        message: `user not found`,
        success: false,
      });
    //* Validate register number
    if (updateDetails.regno) {
      let registerNumberNotTaken = await validate({
        regno: updateDetails.regno,
      });
      if (!registerNumberNotTaken)
        return res.status(403).json({
          message: `Register number already exists.`,
          success: false,
        });
    }
    //* Validate email
    if (updateDetails.email) {
      let emailNotTaken = await validate({ email: updateDetails.email });
      if (!emailNotTaken)
        return res.status(403).json({
          message: `Email already exists.`,
          success: false,
        });
    }
    //! Student cannot access admin data
    if (req.user.role === "student" && user.role.name === "admin")
      return res.status(401).json({
        message: `Unauthorized access`,
        success: false,
      });
    let userDetails = {};
    //* Only admins can change these data
    if (req.user.role === "admin") {
      if (updateDetails.newPassword) {
        let hashedPassword = await bcrypt.hash(updateDetails.newPassword, 8);
        userDetails.password = hashedPassword;
      }
      if (updateDetails.regno) userDetails.regno = updateDetails.regno;
      if (updateDetails.role)
        userDetails.role_id = await mapRoleId(updateDetails.role);
    }
    if (updateDetails.name) userDetails.name = updateDetails.name;
    if (updateDetails.phone_no) userDetails.phone_no = updateDetails.phone_no;
    if (updateDetails.gender)
      userDetails.gender_id = await mapGenderId(updateDetails.gender);
    if (updateDetails.stream)
      userDetails.stream_id = await mapStreamId(updateDetails.stream);
    if (updateDetails.college)
      userDetails.college_id = await mapCollegeId(updateDetails.college);
    if (updateDetails.course)
      userDetails.course_id = await mapCourseId(updateDetails.course);
    if (updateDetails.batch)
      userDetails.batch_id = await mapBatchId(updateDetails.batch);
    await User.findByIdAndUpdate(user._id, userDetails);
    res.status(200).json({
      userDetails,
      message: "User updated",
      success: true,
    });
  } catch (err) {
    //! Error in finding user details
    console.log(err);
    res.status(500).json({
      message: `unable to find user details`,
      success: false,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    let user = await User.findOne({
      regno: req.params.id,
      deleted_at: null,
    }).populate({ path: "role_id", model: "role", select: "name" });
    //! User not found
    if (!user || user.deleted_at)
      return res.status(404).json({
        message: `user not found`,
        success: false,
      });
    //! Student cannot access admin data
    if (req.user.role === "student" && user.role_id.name === "admin")
      return res.status(401).json({
        message: `Unauthorized access`,
        success: false,
      });
    user.deleted_at = Date.now();
    user.depopulate();
    await user.save();
    res.status(204).json({
      message: "User deleted",
      success: true,
    });
  } catch (err) {
    //! Error in finding user details
    console.log(err);
    res.status(500).json({
      message: `unable to find user details`,
      success: false,
    });
  }
};
const createBulkUsers = async (req, res) => {
  let userDetails = req.user._doc;
  const file = req.files.excel;
  const dirCodes = join(__dirname, "/../static", "resources");
  if (!fs.existsSync(dirCodes)) fs.mkdirSync(dirCodes, { recursive: true });
  const fileName = `${UUID()}.xlsx`;
  const filePath = join(dirCodes, fileName);
  file.mv(filePath);
  const schema = {
    regno: { prop: "regno", type: String },
    name: { prop: "name", type: String },
    email: { prop: "email", type: String },
    role: { prop: "role_id", type: String },
    gender: { prop: "gender_id", type: String },
    stream: { prop: "stream_id", type: String },
    course: { prop: "course_id", type: String },
    college: { prop: "college_id", type: String },
    phone_no: { prop: "phone_no", type: Number },
    batch: { prop: "batch_id", type: String },
  };
  try {
    let errors = [],
      errorLogs;
    let { rows, err } = await xlsx(filePath, { schema });
    for (let i in rows) {
      try {
        await createUserService(rows[i]);
      } catch (err) {
        if (err.code === 403 || err.code === 500) errors.push(err.regno);
      }
    }
    if (errors.length !== 0) {
      errorLogs = new ErrorLogs({
        errorLogs: errors,
        totalLogs: rows.length,
        created_by: userDetails._id,
      });
      await errorLogs.save();
    }
    fs.unlink(filePath, (err) => (err ? console.log(err) : null));
    res.status(200).json({ errorLogs });
  } catch (err) {
    //! Error in creating user
    res.status(500).json({
      message: `Error in creating users`,
    });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    let response = {};
    if(page == 1) {
      const count = await User.countDocuments();
      response.modelCount = count;
    }
    const users = await User.find({ isActive: true })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    response.total = users.length;
    response.users = users;
    res.status(200).json(response);
  } catch (err) {
    //! Error in finding user details
    console.log(err)
    res.status(500).json({
      message: `unable to get user details`,
      success: false,
    });
  }
};
module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  createBulkUsers,
  getAllUsers,
};
