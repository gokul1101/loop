const common = [
  "getUser",
  "updateUser",
  "getContest",
  "getContestForDashboard",
  "getAllContests",
  "getQuiz",
  "getAllQuizzes",
  "getQuestion",
  "getAllMCQS",
  "getAllChallenges",
  "createSubmission",
  "compiler",
  "getTestCases",
  "executeContestChallenge"
];
const student = [...common];
const admin = [
  ...common,
  "createUser",
  "deleteUser",
  "createBulkUsers",
  "getAllUsers",
  "createContest",
  "updateContest",
  "deleteContest",
  "createQuestion",
  "updateQuestion",
  "createQuiz",
  "updateQuiz",
  "createTestCase",
  "updateTestCase",
  "createMultipleTestCases",
  "deleteQuestion"
];

module.exports = {
  API: {student, admin },
};
