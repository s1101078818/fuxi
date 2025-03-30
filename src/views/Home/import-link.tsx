import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { getLinkContent, importData } from "@/apis/import";
import { toast } from "sonner";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";

const LinkSource = [
  {
    name: "小红书",
    value: "1",
  },
  {
    name: "今日头条",
    value: "2",
  },
  {
    name: "微信公众号",
    value: "3",
  },
  {
    name: "知乎",
    value: "4",
  },
  {
    name: "微博",
    value: "5",
  },
  {
    name: "其他",
    value: "6",
  },
];

interface ImportLinkProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const FormSchema = z.object({
  originType: z.string({
    required_error: "请选择来源类型。",
  }),
  url: z.string({
    required_error: "请输入链接。",
  }),
});

export function ImportLink({ open, setOpen }: ImportLinkProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [previewData, setPreviewData] = useState<any>();
  const [previewShow, setPreviewShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      originType: LinkSource[0].value as z.infer<
        typeof FormSchema
      >["originType"],
      url: "",
    },
  });

  const openChange = (o: boolean) => {
    setOpen(o);
  };

  const handle = async () => {
    setLoading(true);
    try {
      console.log("form values:", form.getValues());
      const data = form.getValues();
      // 验证表单
      const result = await form.trigger();
      if (!result) {
        return;
      }
      // 获取链接内容
      const res = await getLinkContent(data);
      if (res) {
        toast.success("获取链接成功");
        console.log("res:", res);
        setPreviewData(res);
        setPreviewShow(true);
      } else {
        toast.error("获取链接失败");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>导入链接</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <FormField
              control={form.control}
              name="originType"
              render={({ field }) => (
                <FormItem>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex gap-5 flex-wrap"
                  >
                    {LinkSource.map((item) => (
                      <div
                        className="flex items-center space-x-2"
                        key={item.value}
                      >
                        <RadioGroupItem value={item.value} id={item.value} />
                        <Label htmlFor={item.value}>{item.name}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <Textarea
                    {...field}
                    placeholder="请输入链接，支持多个链接，每行一个"
                    className="w-full"
                  />
                </FormItem>
              )}
            />
          </Form>

          <DialogFooter>
            <Button
              className="cursor-pointer bg-gray-100 hover:bg-gray-300 text-black"
              onClick={() => {
                form.reset(); // 重置表单数据
                setPreviewData(null); // 清空预览数据
                setPreviewShow(false); // 关闭预览窗口
                openChange(false);
              }}
            >
              取消
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handle}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  请稍候，正在获取数据
                </>
              ) : (
                "确定"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={previewShow} onOpenChange={setPreviewShow}>
        <DialogContent className="sm:max-w-[920px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>预览</DialogTitle>
          </DialogHeader>

          {previewData && (
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full rounded-md border">
                <div className="p-4 h-full">
                  <Editor
                    value={previewData}
                    onChange={setPreviewData}
                    mode="code"
                    htmlElementProps={{ style: { height: "65vh" } }}
                  />
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}

          <DialogFooter className="sm:justify-end">
            <Button
              className="cursor-pointer"
              type="button"
              variant="secondary"
              onClick={() => {
                setPreviewShow(false);
                setPreviewData(null);
              }}
            >
              取消
            </Button>
            <Button
              className="cursor-pointer"
              type="button"
              onClick={async () => {
                const data = {
                  url: form.getValues().url,
                  originType: Number(form.getValues().originType),
                  content: JSON.stringify(previewData),
                };
                console.log(data);
                const res = await importData(data);
                if (res) {
                  console.log("res:", res);
                  toast.success("导入成功");
                  setPreviewShow(false);
                  setPreviewData(null);
                } else {
                  toast.error("导入失败");
                }
              }}
            >
              导入
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
