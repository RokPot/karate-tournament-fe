/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from "axios";
import { z } from "zod";

import { LoggingInterceptor } from "@/util/rest/interceptors/logging.interceptor";
import { ResponseInterceptor } from "@/util/rest/interceptors/response.interceptor";
import { RestInterceptor } from "@/util/rest/interceptors/rest-interceptor";
import { ErrorHandler, GeneralErrorCodes, SharedErrorHandler } from "@/util/vendor/error-handling";

interface RequestInfo<ZResDto extends z.ZodRawShape, ResDto, Res, ECodes extends string> {
  resSchema: z.ZodEffects<z.ZodObject<ZResDto, "strip", z.ZodTypeAny, ResDto>, Res> | z.ZodSchema<Res>;
  errorHandler?: ErrorHandler<ECodes>;
}

type Method = "get" | "post" | "patch" | "put" | "delete";

const MethodHasBody: Record<Method, boolean> = {
  get: false,
  post: true,
  patch: true,
  put: true,
  delete: true,
};

export class RestClient {
  private client: AxiosInstance;

  constructor({
    config,
    interceptors,
  }: {
    config?: CreateAxiosDefaults;
    interceptors?: RestInterceptor<any[]>[];
  } = {}) {
    this.client = axios.create(config);

    const defaultInterceptors = [LoggingInterceptor, ResponseInterceptor];

    this.attachInterceptors(defaultInterceptors);
    this.attachInterceptors(interceptors);
  }

  public attachInterceptors<T extends any[]>(interceptors?: RestInterceptor<T>[], ...args: T) {
    if (interceptors != null) {
      interceptors.forEach((interceptor) => this.attachInterceptor(interceptor, ...args));
    }
  }

  public attachInterceptor<T extends any[]>(interceptor: RestInterceptor<T>, ...args: T) {
    interceptor.addInterceptor(this.client, ...args);
  }

  public ejectInterceptor<T extends any[]>(interceptor: RestInterceptor<T>) {
    interceptor.removeInterceptor(this.client);
  }

  public async get<ZResDto extends z.ZodRawShape, ResDto, Res, ECodes extends string = GeneralErrorCodes>(
    requestInfo: RequestInfo<ZResDto, ResDto, Res, ECodes>,
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<Res> {
    return this.makeRequest(requestInfo, "get", url, undefined, config);
  }

  public async post<ZResDto extends z.ZodRawShape, ResDto, Res, ECodes extends string = GeneralErrorCodes>(
    requestInfo: RequestInfo<ZResDto, ResDto, Res, ECodes>,
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<Res> {
    return this.makeRequest(requestInfo, "post", url, data, config);
  }

  public async patch<ZResDto extends z.ZodRawShape, ResDto, Res, ECodes extends string = GeneralErrorCodes>(
    requestInfo: RequestInfo<ZResDto, ResDto, Res, ECodes>,
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<Res> {
    return this.makeRequest(requestInfo, "patch", url, data, config);
  }

  public async put<ZResDto extends z.ZodRawShape, ResDto, Res, ECodes extends string = GeneralErrorCodes>(
    requestInfo: RequestInfo<ZResDto, ResDto, Res, ECodes>,
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<Res> {
    return this.makeRequest(requestInfo, "put", url, data, config);
  }

  public async delete<ZResDto extends z.ZodRawShape, ResDto, Res, ECodes extends string = GeneralErrorCodes>(
    requestInfo: RequestInfo<ZResDto, ResDto, Res, ECodes>,
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<Res> {
    return this.makeRequest(requestInfo, "delete", url, data, config);
  }

  private async makeRequest<ZResDto extends z.ZodRawShape, ResDto, Res, ECodes extends string = GeneralErrorCodes>(
    requestInfo: RequestInfo<ZResDto, ResDto, Res, ECodes>,
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<Res> {
    try {
      let res: AxiosResponse;
      if (MethodHasBody[method]) {
        res = await this.client[method](url, data, config);
      } else {
        res = await this.client[method](url, config);
      }
      if (!Object.keys(res).length) {
        return null as Res;
      }

      return requestInfo.resSchema.parse(res) as Res;
    } catch (e) {
      alert(JSON.stringify(e));
      const errorHandler = requestInfo.errorHandler ?? SharedErrorHandler;
      errorHandler.rethrowError(e);
      throw e;
    }
  }
}
