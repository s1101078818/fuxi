import { get, post } from "@/lib/request";

interface linkParams {
  url: string;
  originType: string;
}

// 接口返回类型定义
interface LinkContent {
  title: string;
  content: string;
  url: string;
}

// 获取链接内容
export const getLinkContent = (data: linkParams) => {
  return get<LinkContent>(
    `/origin?Url=${data.url}&OriginType=${data.originType}`
  );
};

interface ImportResult {
  message: string;
}

// 导入数据
export const importData = (data: {
  url: string;
  content: string;
  originType: number;
}) => {
  return post<ImportResult>("/graph/content/append", data);
};
