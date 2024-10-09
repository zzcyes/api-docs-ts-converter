import axios, { AxiosResponse } from "axios";

const timeout = 20000;

const LOGOUT_EVENT = "LOGOUT_EVENT";
//加个防抖，防止弹很多个认真过期的message
const triggerLogOut = () => {
  let logOutEvent = new Event(LOGOUT_EVENT);
  window.dispatchEvent(logOutEvent);
};

const SuccessStatusCodeInterceptor = (response: AxiosResponse<any>) => {
  const { data } = response;
  const { status: businessStatus } = data;
  if (businessStatus) {
    //这里是业务状态码错误的请求逻辑，一般来说我们
    if (businessStatus !== 200) {
      //业务错误时，将后台的msg当做错误信息，供前端进行展示
      return Promise.reject(new Error(data.msg));
    } else {
      //业务正确时，正常返回
      return response;
    }
  }
  //没有业务状态码，但http状态码为2xx的时候正常返回
  return response;
};

const FailStatusCodeInterceptor = (error: any) => {
  if (error.response) {
    console.log("respoonse error in response interceptor", error);
    const { status } = error.response;
    if (status === 401) {
      triggerLogOut();
    }
  }
  return Promise.reject(error);
};

const request = axios.create({
  timeout: timeout,
  withCredentials: true,
});

request.interceptors.response.use(
  SuccessStatusCodeInterceptor,
  FailStatusCodeInterceptor
);

interface IListResType<T> {
  msg: string; //描述
  status: number; //状态码
  data: T[];
  total: number | null;
}

//用作对象返回
interface IDataResType<T> {
  msg: string; //描述
  status: number; //状态码
  data: T;
}

interface IFUserInfo {
  accountNonExpired?: boolean; //未知
  accountNonLocked?: boolean; //未知
  authorities?: any[]; //权限？
  created: string; //创建日期
  credentialsNonExpired?: boolean; //未知
  department?: number; //未知
  enabled?: boolean; //未知
  endtime?: string; //未知
  expired?: any; //未知
  ipLimit?: any; //未知
  ipv4?: string; //ipv4地址
  ipv6?: string; //ipv6地址
  isLogin?: boolean; //是否在线
  lastLoginTime?: string; //上次登录时间
  loginCount: number; //登录次数
  loginLimit?: any; //未知
  name?: string; //未知
  phone?: string; //未知
  roleId: number; //用户类型
  roles?: any[]; //未知
  starttime?: string; //未知
  uid: number; //用户id
  updated: string; //更新时间
  username: string; //用户名
}

interface IGetUserListPayload {
  page: number; // 页数
  pageSize: number; // 页码
  userName?: string; // 用户
}

interface ICreateUserPayload {
  username: string; // 用户
  password: string; // 密码
  roleId: number; // 角色id
  ipv4?: string; // ipv4地址
  ipv6?: string; // ipv6地址
}

interface IModifyUserPayload {
  uid: number;
  username: string;
  roleId: number;
  ipv4?: string;
  ipv6?: string;
}

class UserApiClass {
  getUserList = (payload: IGetUserListPayload) =>
    request
      .post<IListResType<IFUserInfo>>("/iapp/user/page", payload)
      .then((res) => res.data);

  createUser = (payload: ICreateUserPayload) =>
    request
      .post<IDataResType<boolean>>("/iapp/user/save", payload)
      .then((res) => res.data);

  modifyUser = (payload: IModifyUserPayload) =>
    request
      .put<IDataResType<boolean>>("/iapp/user/modify", payload)
      .then((res) => res.data);

  deleteUserById = (id: number, age: string) =>
    request
      .delete<IDataResType<boolean>>(`/iapp/user/${id}?age=${age}`)
      .then((res) => res.data);
}

export const UserApi = new UserApiClass();
