import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Menu } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { Message } from "@/components/chat/message";

export default function Chat() {
  const nav = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(
    window.matchMedia("(min-width: 640px)").matches
  );
  const goBack = () => {
    nav(-1);
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 首先在文件顶部添加一个类型定义
  interface Message {
    type: "system" | "answer" | "question";
    content: string;
    suggestions?: string[]; // 添加建议提示数组
  }

  // 修改初始消息的类型
  const [messages, setMessages] = useState<Message[]>([
    { type: "answer", content: "有什么可以帮助你的吗?" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const latestMessageContent = useRef("");

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken") || "");
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // 添加用户消息
    setMessages((prev) => [
      ...prev,
      { type: "question", content: inputMessage },
    ]);
    setInputMessage("");
    setIsLoading(true);

    let reader;
    try {
      const response = await fetch(
        "https://xmc-saas-bgw-dev.azure-api.net/api/grag-demo/graph/search-result",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
          body: JSON.stringify({ query: inputMessage }),
        }
      );

      if (!response.ok) throw new Error("请求失败");

      reader = response.body?.getReader();
      if (!reader) throw new Error("无法获取响应流");

      // 创建新消息用于流式更新
      setMessages((prev) => [...prev, { type: "answer", content: "" }]);
      latestMessageContent.current = "";

      let isDone = false;
      while (!isDone) {
        const { done, value } = await reader.read();
        if (done) {
          isDone = true;
          break;
        }

        // 解码并更新最后一条消息
        const text = new TextDecoder().decode(value);
        try {
          // 按换行符分割并处理每个数据块
          const lines = text.split("\n");
          for (const line of lines) {
            if (!line.trim() || !line.startsWith("data: ")) continue;
            // 处理结束标记
            if (line.includes("[DONE]")) {
              isDone = true;
              break;
            }

            try {
              const jsonText = line.replace(/^data:\s*/, "").trim();
              const jsonData = JSON.parse(jsonText);

              if (jsonData.choices?.[0]?.delta?.content) {
                const content = jsonData.choices[0].delta.content;
                latestMessageContent.current += content;
                setMessages((prev) => {
                  // 创建消息数组的浅拷贝，避免直接修改状态
                  const newMessages = [...prev];
                  // 获取数组中最后一条消息（当前正在更新的 AI 回复）
                  const lastMessage = newMessages[newMessages.length - 1];
                  // 使用 useRef 中存储的完整内容更新最后一条消息
                  // 这样可以避免状态更新的竞态条件，确保内容的完整性
                  lastMessage.content = latestMessageContent.current;

                  // 这里假设后端提供seggestions，则在回答结束时添加建议提示！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
                  if (jsonData.suggestions) {
                    lastMessage.suggestions = jsonData.suggestions;
                  }
                  // 这里先模拟一下
                  lastMessage.suggestions = [
                    "能详细解释一下吗？",
                    "有具体的例子吗？",
                    "还有其他相关内容吗？",
                  ];

                  // 返回更新后的消息数组，触发 React 重新渲染
                  return newMessages;
                });
              }
            } catch {
              // 忽略单个 JSON 块的解析错误，继续处理下一块
              continue;
            }
          }
        } catch (e) {
          console.error("JSON 解析失败:", e);
        }
      }
    } catch (error) {
      console.error("发送消息失败:", error);
      setMessages((prev) => [
        ...prev,
        { type: "system", content: "发送消息失败，请重试" },
      ]);
    } finally {
      // 确保在结束时关闭读取器
      if (reader) {
        try {
          await reader.cancel();
        } catch (e) {
          console.error("关闭读取器失败:", e);
        }
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="p-4 h-screen mx-auto">
        <div
          className="hidden cursor-pointer sm:flex items-center gap-2 w-[100px]"
          onClick={goBack}
        >
          <ArrowLeft size={24} />
          <span>返回</span>
        </div>

        <div className="flex h-full space-y-4">
          {/* 左侧菜单区域 */}
          <div className="flex h-full">
            {/* 可折叠菜单内容 - 左右展开 */}
            <div
              className={`${
                isMenuOpen ? "w-[150px] sm:w-[200px]" : "w-0"
              } h-full  shadow-md transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="p-3 space-y-3 ">
                <button className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md text-center transition-colors">
                  新建对话
                </button>
                <div className="space-y-2 text-sm">
                  {/* 对话列表 */}
                  <div className="p-2 rounded-md cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis transition-colors hover:bg-blue-100 active:bg-blue-200">
                    如何学习摄影?
                  </div>
                  <div className="p-2 rounded-md cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis transition-colors hover:bg-blue-100 active:bg-blue-200">
                    曝光三要素
                  </div>
                  <div className="p-2 rounded-md cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis transition-colors hover:bg-blue-100 active:bg-blue-200">
                    如何学习摄影?
                  </div>
                  <div className="p-2 rounded-md cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis transition-colors hover:bg-blue-100 active:bg-blue-200">
                    曝光三要素
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧聊天区域 */}
          <div className="flex-1 flex flex-col">
            <button
              className="h-10 w-10 flex items-center justify-center  rounded-l-md shadow-sm transition-colors"
              onClick={toggleMenu}
            >
              <Menu size={20} className="text-gray-600 cursor-pointer" />
            </button>
            {/* 聊天消息列表 */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {messages.map((message, index) => (
                <div key={index} className="space-y-2">
                  <Message
                    key={index}
                    type={message.type as "system" | "answer" | "question"}
                    content={message.content}
                  />
                  {message.type === "answer" && message.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInputMessage(suggestion);
                          }}
                          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 消息输入框 */}
            <div className="p-4 grid grid-cols-[1fr_auto] gap-0">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="请输入你的问题"
                className="border py-2 px-3 text-gray-700 focus:outline-none h-full"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className={`cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-r-md h-full transition-colors ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
