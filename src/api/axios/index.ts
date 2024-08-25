// axios配置
import Axios from 'axios';
import Api from './api.config';
//import store from '@/redux/store';
// import { setLoading } from '@/redux/action';
import { Toast } from 'antd-mobile';
//import qs from 'qs'

/* 添加一个计数器 */
let needLoadingRequestCount = 0;
let ToastGlobal: ReturnType<typeof Toast.show>;

function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    //store.dispatch(setLoading(true));
    ToastGlobal = Toast.show({
      duration: 0,
      icon: 'loading',
      content: '加载中…',
    });
  }
  needLoadingRequestCount++;
}

function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    //store.dispatch(setLoading(false));
    ToastGlobal?.close();
  }
}

export const baseURL = Api.baseURL;

type configDataType = {
  contentType?: string;
};

export const AxiosInit = (obj: configDataType = {}) => {
  const axios = Axios.create({
    //withCredentials: true,
    //crossDomain: true,
    baseURL: Api.baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': obj.contentType ?? 'application/json;charset=UTF-8',
      'Cache-Control': 'no-cache',
    },
  });

  axios.interceptors.request.use(
    (config) => {
      showFullScreenLoading();
      return config;
    },
    (err) => {
      tryHideFullScreenLoading();

      Toast.show({
        icon: 'fail',
        content: `网络错误: ${JSON.stringify(err)}`,
      });

      console.log('err');
      return Promise.reject(err);
    },
  );

  // code状态码拦截
  axios.interceptors.response.use(
    (res) => {
      tryHideFullScreenLoading();
      const status = res.status;
      if (status === 200 || status === 204 || status === 304) {
        // if (res.data.code !== 0) {
        //   Toast.show({
        //     icon: 'fail',
        //     content: `返回错误: ${JSON.stringify(res.data)}`,
        //   });

        //   return Promise.reject(res);
        // }
        return res.data;
      }
      if (status === 401) {
        // 跳转登录
        window.open('https://fengjinlovewei.com');
      }
      Toast.show({
        icon: 'fail',
        content: `网络错误1: ${JSON.stringify(res.data)}`,
      });

      return Promise.reject(res);
    },
    (err) => {
      tryHideFullScreenLoading();
      console.log(err);

      Toast.show({
        icon: 'fail',
        content: `网络错误2: ${JSON.stringify(err)}`,
      });

      const status = err.response.status;

      if (status === 401 || status === 400) {
        console.log('token失效');
      }

      if (status === 403) {
        console.log('您没有权限');
      }

      return Promise.reject(err.response.data);
    },
  );

  return axios;
};

const axiosForm = AxiosInit({
  contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
});

const axiosJson = AxiosInit({
  contentType: 'application/json;charset=UTF-8',
});

export default AxiosInit;

export { axiosForm, axiosJson };
