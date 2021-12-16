import axios from "axios";
const baseURL = "http://localhost:5000";

const helperService = {
  rejectionHandler: ({ response }) => {
    return Promise.reject({
      status: response.status,
      data: response.data,
    });
  },
  //* =================== PUBLIC ROUTE ==================== *//
  login: async (payload) => {
    try {
      const { status, data } = await axios.post(
        `${baseURL}/api/v1/login`,
        payload
      );
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
          message: data.message,
        });
      }
    } catch (err) {
      let { status, data } = err.response;
      return Promise.reject({
        status,
        message: data.message,
      });
    }
  },
  //* ================= PRIVATE ROUTES ======================== *//
  //** MULTIPLE USERS */
  getUsers: async ({ page, limit }, config) => {
    try {
      const { status, data } = await axios.get(
        `${baseURL}/api/v1/users/getAll?page=${page}&limit=${limit}`,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch ({ response }) {
      return Promise.reject({
        status: response.status,
        data: response.data,
      });
    }
  },
  createBulkUsers: async (payload, config) => {
    try {
      const { data, status } = await axios.post(
        `${baseURL}/api/v1/user/create/all`,
        payload,
        config
      );
      if (status === 201) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
  //** USERS */
  createUser: async (payload, config) => {
    console.log(payload, config);
    try {
      const { data, status } = await axios.post(
        `${baseURL}/api/v1/user/create`,
        payload,
        config
      );
      if (status === 201) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
  getUser: async (payload, config) => {
    let url = `${baseURL}/api/v1/user/get`;
    if (payload.id) url += `?id=${payload.id}`;
    else if (payload.regno) url += `?regno=${payload.regno}`;
    try {
      const { status, data } = await axios.get(url, config);
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch ({ response }) {
      return Promise.reject({
        status: response.status,
        data: response.data,
      });
    }
  },
  //** CONTESETS */
  createContest: async (payload, config) => {
    try {
      const { data, status } = await axios.post(
        `${baseURL}/api/v1/contest/create`,
        payload,
        config
      );
      return Promise.resolve({
        status,
        data,
      });
    } catch (err) {
      console.log(err);
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
  // TODO :: Have to change for individual contest
  getContestWithCode: async (payload, config) => {
    let url = `${baseURL}/api/v1/contest/dashboard`;
    if (payload.id) url += `?id=${payload.id}`;
    else if (payload.code) url += `?code=${payload.code}`;
    try {
      const { data, status } = await axios.get(url, config);
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      return Promise.reject({
        status: err?.response?.status,
        message: err?.response?.data,
      });
    }
  },
  getContest: async (payload, config) => {
    let url = `${baseURL}/api/v1/contest/get`;
    if (payload.id) url += `?id=${payload.id}`;
    else if (payload.code) url += `?code=${payload.code}`;
    try {
      const { data, status } = await axios.get(url, config);
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      return Promise.reject({
        status: err?.response?.status,
        message: err?.response?.data,
      });
    }
  },
  updateContest: async (payload, config) => {
    try {
      const { data, status } = await axios.post(
        `${baseURL}/api/v1/contest/update`,
        payload,
        config
      );
      return Promise.resolve({
        status,
        data,
      });
    } catch (err) {
      console.log(err);
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
  getAllContests: async (payload, config) => {
    try {
      const { data, status } = await axios.get(
        `${baseURL}/api/v1/contests/getAll`,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      console.log(err);
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
  //** QUIZZS */
  createQuizz: async (payload, config) => {
    try {
      const { data, status } = await axios.post(
        `${baseURL}/api/v1/quiz/create`,
        payload,
        config
      );
      if (status === 201) {
        return Promise.resolve({
          data,
          status,
        });
      }
    } catch (err) {
      console.log(err);
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
  getQuizzes: async ({ id }, config) => {
    try {
      const { data, status } = await axios.get(
        `${baseURL}/api/v1/quiz/all?id=${id}`,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          data,
          status,
        });
      }
    } catch (err) {
      console.log(err);
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
  getQuizQuestions: async ({ id, page = 1 }, config) => {
    try {
      const { data, status } = await axios.get(
        `${baseURL}/api/v1/mcq/all?id=${id}&page=${page}`,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          data,
          status,
        });
      }
    } catch (err) {
      console.log(err);
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
  createQuizQuestion: async (payload, config) => {
    try {
      const { data, status } = await axios.post(
        `${baseURL}/api/v1/question/create`,
        payload,
        config
      );
      if (status === 201) {
        return Promise.resolve({
          data,
          status,
        });
      }
    } catch (err) {
      console.log(err);
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
  //** CHALLENGES */
  createChallenge: async (payload, config) => {
    try {
      const { data, status } = await axios.post(
        `${baseURL}/api/v1/question/create`,
        payload,
        config
      );
      if (status === 201) {
        return Promise.resolve({
          data,
          status,
        });
      }
    } catch (err) {
      console.log(err);
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
  getChallenges: async ({ id }, config) => {
    try {
      const { data, status } = await axios.get(
        `${baseURL}/api/v1/challenges/all?id=${id}`,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          data,
          status,
        });
      }
    } catch (err) {
      console.log(err);
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
  //** QUESTIONS */
  getQuestion: async ({ id, type }, config) => {
    try {
      const { data, status } = await axios.get(
        `${baseURL}/api/v1/question/get?id=${id}&type=${type} `,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          data,
          status,
        });
      }
    } catch (err) {
      console.log(err);
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
  updateQuestion: async (payload, config) => {
    try {
      const { data, status } = await axios.post(
        `${baseURL}/api/v1/question/update?type=${payload.type_id}`,
        payload,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          data,
          status,
        });
      }
    } catch (err) {
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
  deleteQuestion: async (payload, config) => {
    try {
      const { data, status } = await axios.post(
        `${baseURL}/api/v1/question/delete?type=${payload.type_id}`,
        payload,
        config
      );
      if (status === 202) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
  createTestcase: async (payload, config) => {
    try {
      const { data, status } = await axios.post(
        `${baseURL}/api/v1/testcase/create`,
        payload,
        config
      );
      if (status === 201) {
        return Promise.resolve({
          data,
          status,
        });
      }
    } catch (err) {
      console.log(err);
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
  //** COMPILE */
  compile: async (payload, config) => {
    try {
      const { data, status } = await axios.post(
        `${baseURL}/api/v1/compiler`,
        payload,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          status,
          data,
        });
      }
    } catch (err) {
      console.log(err);
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
  getTestCases: async ({ questionId }, config) => {
    try {
      const { data, status } = await axios.get(
        `${baseURL}/api/v1/testcase/get?id=${questionId}`,
        config
      );
      if (status === 200) {
        return Promise.resolve({
          data,
        });
      }
    } catch (err) {
      console.log(err);
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
  createSubmission: async (payload, config) => {
    try {
      const {
        data: { message },
        status,
      } = await axios.post(
        `${baseURL}/api/v1/submission/create`,
        payload,
        config
      );
      if (status === 201) {
        return Promise.resolve({
          message,
        });
      }
    } catch (err) {
      console.log(err);
      return Promise.reject({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
};
export default helperService;
