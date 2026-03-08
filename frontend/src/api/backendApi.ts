/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum CryptoCurrencyEnum {
  Bitcoin = "Bitcoin",
  Ethereum = "Ethereum",
  Tether = "Tether",
  USDCoin = "USD_Coin",
  BinanceCoin = "BinanceCoin",
  XRP = "XRP",
  Cardano = "Cardano",
  Solana = "Solana",
  Dogecoin = "Dogecoin",
}

export interface CompanyResponse {
  /** @format uuid */
  id?: string;
  cnpj?: string | null;
  companyName?: string | null;
  fullName?: string | null;
  cryptoCurrencies?: CryptoCurrencyEnum[] | null;
  phone?: string | null;
  email?: string | null;
  /** @format date-time */
  createdAt?: string;
}

export interface CryptoCurrencyDto {
  value: CryptoCurrencyEnum;
  /** @minLength 1 */
  alias: string;
}

export interface DocumentRequest {
  /** @minLength 1 */
  name: string;
  /** @format int64 */
  size: number;
  /** @minLength 1 */
  type: string;
}

export interface DocumentResponse {
  /** @format uuid */
  id?: string;
  name?: string | null;
  /** @format int64 */
  size?: number;
  type?: string | null;
  /** @format date-time */
  uploadedAt?: string;
}

export interface LoginRequest {
  /**
   * @format email
   * @minLength 1
   */
  email: string;
  /** @minLength 1 */
  password: string;
}

export interface LoginResponse {
  /** @format uuid */
  companyId?: string;
  email?: string | null;
  companyName?: string | null;
  token?: string | null;
}

export interface PartnerResponse {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  companyId?: string;
  fullName?: string | null;
  cpf?: string | null;
  nationality?: string | null;
  /** @format double */
  shareholding?: number;
  isPep?: boolean;
  documents?: DocumentResponse[] | null;
  /** @format date-time */
  createdAt?: string;
}

export interface RegisterCompanyRequest {
  /** @minLength 1 */
  cnpj: string;
  /** @minLength 1 */
  companyName: string;
  /** @minLength 1 */
  fullName: string;
  /** @minItems 1 */
  cryptoCurrencies: CryptoCurrencyEnum[];
  /** @minLength 1 */
  phone: string;
  /**
   * @format email
   * @minLength 1
   */
  email: string;
  /** @minLength 8 */
  password: string;
}

export interface RegisterPartnerRequest {
  /** @format uuid */
  companyId: string;
  /** @minLength 1 */
  fullName: string;
  /** @minLength 1 */
  cpf: string;
  /** @minLength 1 */
  nationality: string;
  /**
   * @format double
   * @min 0.01
   * @max 100
   */
  shareholding: number;
  isPep?: boolean;
  documents?: DocumentRequest[] | null;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Api
 * @version 1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @tags Auth
     * @name AuthLoginCreate
     * @request POST:/api/Auth/login
     */
    authLoginCreate: (data: LoginRequest, params: RequestParams = {}) =>
      this.request<LoginResponse, any>({
        path: `/api/Auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  company = {
    /**
     * No description
     *
     * @tags Company
     * @name CompanyList
     * @request GET:/api/Company
     */
    companyList: (params: RequestParams = {}) =>
      this.request<CompanyResponse[], any>({
        path: `/api/Company`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name CompanyRegisterCreate
     * @request POST:/api/Company/register
     */
    companyRegisterCreate: (
      data: RegisterCompanyRequest,
      params: RequestParams = {},
    ) =>
      this.request<CompanyResponse, any>({
        path: `/api/Company/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name CompanyDetail
     * @request GET:/api/Company/{id}
     */
    companyDetail: (id: string, params: RequestParams = {}) =>
      this.request<CompanyResponse, any>({
        path: `/api/Company/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name CompanyCnpjDetail
     * @request GET:/api/Company/cnpj/{cnpj}
     */
    companyCnpjDetail: (cnpj: string, params: RequestParams = {}) =>
      this.request<CompanyResponse, any>({
        path: `/api/Company/cnpj/${cnpj}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name CompanyExistsList
     * @request GET:/api/Company/exists
     */
    companyExistsList: (
      query?: {
        cnpj?: string;
        email?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<boolean, any>({
        path: `/api/Company/exists`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  currency = {
    /**
     * No description
     *
     * @tags Currency
     * @name CurrencyMostValuableCurrencyList
     * @request GET:/api/Currency/most-valuable-currency
     */
    currencyMostValuableCurrencyList: (params: RequestParams = {}) =>
      this.request<CryptoCurrencyDto, any>({
        path: `/api/Currency/most-valuable-currency`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Currency
     * @name CurrencyAllCryptoCurrenciesList
     * @request GET:/api/Currency/all-crypto-currencies
     */
    currencyAllCryptoCurrenciesList: (params: RequestParams = {}) =>
      this.request<CryptoCurrencyDto[], any>({
        path: `/api/Currency/all-crypto-currencies`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  partner = {
    /**
     * No description
     *
     * @tags Partner
     * @name PartnerRegisterCreate
     * @request POST:/api/Partner/register
     */
    partnerRegisterCreate: (
      data: RegisterPartnerRequest,
      params: RequestParams = {},
    ) =>
      this.request<PartnerResponse, any>({
        path: `/api/Partner/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Partner
     * @name PartnerDetail
     * @request GET:/api/Partner/{id}
     */
    partnerDetail: (id: string, params: RequestParams = {}) =>
      this.request<PartnerResponse, any>({
        path: `/api/Partner/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Partner
     * @name PartnerCompanyDetail
     * @request GET:/api/Partner/company/{companyId}
     */
    partnerCompanyDetail: (companyId: string, params: RequestParams = {}) =>
      this.request<PartnerResponse[], any>({
        path: `/api/Partner/company/${companyId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Partner
     * @name PartnerCompanyShareholdingList
     * @request GET:/api/Partner/company/{companyId}/shareholding
     */
    partnerCompanyShareholdingList: (
      companyId: string,
      params: RequestParams = {},
    ) =>
      this.request<number, any>({
        path: `/api/Partner/company/${companyId}/shareholding`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
