import { get } from "@/lib/request";

interface TripleItem {
  id: string; // 三元组id
  subject: string; // 主体
  predicate: string; // 关系
  object: string; // 客体
  community: string; // 三元组所属社区
}

interface Response {
  data: TripleItem[];
}

// 用户登录
export const getTripleList = () => {
  return get<Response>("/graph/spos");
};
