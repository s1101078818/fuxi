/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImportLink } from "@/views/Home/import-link";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Graph from "@/components/graph";
import { getTripleList } from "@/apis/triple";

export default function Home() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [skeleton, setSkeleton] = useState(true); // 骨架屏加载状态
  const [importLinkOpen, setImportLinkOpen] = useState(false); // 导入链接弹窗
  const [menuOpen, setMenuOpen] = useState(false); // 移动端菜单状态
  const [tripleList, setTripleList] = useState<any>([]); // 添加三元组列表状态
  const [triple, setTriple] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTripleList();
        if (res) {
          setTripleList(res.data);
        }
      } catch (error) {
        console.error("获取三元组列表失败:", error);
      } finally {
        setSkeleton(false);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toChat = () => {
    nav("/chat");
  };

  const importLink = () => {
    setImportLinkOpen(true);
  };

  const logout = () => {
    localStorage.clear();
    nav("/login");
  };

  const handleNodeClick = (relatedTriples: any) => {
    setTriple(relatedTriples);
  };

  return (
    <div className="flex flex-col items-center p-2 sm:p-8 max-w-[1500px] mx-auto space-y-8">
      <div className="flex flex-col justify-center gap-6 w-full sm:flex-row">
        <div className="flex flex-col justify-center gap-6 w-full sm:flex-row">
          <Input
            type="text"
            placeholder="社区: 请输入社区"
            className="flex-1 max-w-xs px-4 py-3 rounded-lg"
          />
          <Input
            type="text"
            placeholder="三元组: 请输入三元组"
            className="flex-1 max-w-xs px-4 py-3 rounded-lg "
          />
        </div>
        <div className="flex justify-end gap-6 w-full flex-wrap">
          {/* 桌面端按钮 - 大屏幕显示 */}
          <div className="hidden sm:flex gap-6">
            <Button
              className="cursor-pointer px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300"
              onClick={toChat}
            >
              发起对话
            </Button>
            <Button
              className="cursor-pointer px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300"
              onClick={importLink}
            >
              导入链接
            </Button>
            <Button
              className="cursor-pointer px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-300"
              onClick={logout}
            >
              退出登录
            </Button>
          </div>

          {/* 移动端菜单按钮 - 小屏幕显示 */}
          <div className=" absolute top-[20px] right-0 flex sm:hidden items-center">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger>
                {" "}
                <Menu className="w-8 h-7" />
              </SheetTrigger>
              <SheetContent className="w-[280px] sm:w-[340px]">
                <SheetHeader>
                  <SheetTitle className="text-left">导航菜单</SheetTitle>
                  <SheetDescription className="text-left">
                    选择您要进行的操作
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-2 mt-6">
                  <button
                    onClick={() => {
                      toChat();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all
                      hover:bg-blue-50 hover:text-blue-600
                    border hover:border-blue-300
                    shadow-sm hover:shadow-md"
                  >
                    <span className="ml-2">发起对话</span>
                  </button>
                  <button
                    onClick={() => {
                      importLink();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all
                    hover:bg-blue-50 hover:text-blue-600
                    border hover:border-blue-300
                    shadow-sm hover:shadow-md"
                  >
                    <span className="ml-2">导入链接</span>
                  </button>
                  <div className="border-t my-2"></div>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all
                   text-red-600 hover:bg-red-50 hover:text-red-700
                    border hover:border-red-300
                    shadow-sm hover:shadow-md"
                  >
                    <span className="ml-2">退出登录</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="w-full h-[660px] rounded-xl shadow-md border p-6">
        {loading ? (
          <Loading
            size="default"
            variant="accent"
            text="Loading..."
            className="w-full h-full flex items-center justify-center"
          />
        ) : (
          <>
            {/* 知识图谱的节点和连接线 */}
            <Graph data={tripleList} onNodeClick={handleNodeClick} />
          </>
        )}
      </div>

      <div className="w-full rounded-xl shadow-md border p-6 space-y-4">
        {skeleton ? (
          <>
            <Skeleton className="w-[100px] h-[30px] rounded-3xl " />
            <Skeleton className="w-full h-[20px] rounded-full" />
            <Skeleton className="w-full h-[20px] rounded-full" />
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold border-b pb-2">三元组</h3>
            <div className="space-y-2">
              <p className="">
                <span className="font-medium">主体 (Subject):</span>
                {triple?.subject ?? "-"}
              </p>
              <p className="">
                <span className="font-medium">关系 (Predicate):</span>
                {triple?.predicate ?? "-"}
              </p>
              <p className="">
                <span className="font-medium">客体 (Object):</span>
                {triple?.object ?? "-"}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="w-full  rounded-xl shadow-md border p-6 space-y-4">
        {skeleton ? (
          <>
            <Skeleton className="w-[100px] h-[30px] rounded-3xl" />
            <Skeleton className="w-full h-[20px] rounded-full" />
            <Skeleton className="w-full h-[20px] rounded-full" />
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold border-b pb-2">原文</h3>
            <p className="leading-relaxed">
              摄影快门是相机中控制光线进入感光元件 (如胶片或数字传感器)
              时间长短的装置。它是摄影曝光三要素 之一, 另外两个是光圈和感光速度
              (ISO)。快门的主要功能是决定曝光时间, 即快门速度, 通常以秒或
              几分之一秒为单位表示, 例如1/500秒、1/250秒等。
              快门速度不仅影响曝光量, 还影响图像的动态效果:
            </p>
          </>
        )}
      </div>

      <ImportLink open={importLinkOpen} setOpen={setImportLinkOpen} />
    </div>
  );
}
