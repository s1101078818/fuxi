/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from "react";
import * as echarts from "echarts";

interface Props {
  data?: any[];
  onNodeClick?: (tripleData: any[]) => void; // 添加点击回调属性
}

export default function Graph({ data = [], onNodeClick }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 处理数据，转换为图形节点和连接
  const processData = () => {
    // const nodes: any[] = [];
    const links: any[] = [];
    const nodeMap = new Map();

    data.forEach((item) => {
      // 添加主体节点
      if (!nodeMap.has(item.subject)) {
        nodeMap.set(item.subject, {
          id: item.subject,
          name: item.subject,
          symbolSize: 50,
          category: 0,
        });
      }

      // 添加客体节点
      if (!nodeMap.has(item.object)) {
        nodeMap.set(item.object, {
          id: item.object,
          name: item.object,
          symbolSize: 30,
          category: 1,
        });
      }

      // 添加连接关系
      links.push({
        source: item.subject,
        target: item.object,
        name: item.predicate,
        value: item.predicate,
      });
    });

    return {
      nodes: Array.from(nodeMap.values()),
      links,
    };
  };

  // 关系图配置
  const getOption = () => {
    const { nodes, links } = processData();
    return {
      tooltip: {
        show: true,
        formatter: (params: any) => {
          if (params.dataType === "edge") {
            return `关系：${params.data.value}`;
          }
          return `${params.data.name}`;
        },
      },
      legend: [
        {
          data: ["主体", "客体"],
        },
      ],
      series: [
        {
          name: "知识图谱",
          type: "graph",
          layout: "force",
          data: nodes,
          links: links,
          categories: [{ name: "主体" }, { name: "客体" }],
          roam: true,
          label: {
            show: true,
            position: "right",
            formatter: "{b}",
          },
          force: {
            repulsion: 200,
            edgeLength: 120,
          },
          edgeLabel: {
            show: true,
            formatter: "{c}",
            fontSize: 12,
          },
          lineStyle: {
            color: "#666",
            curveness: 0.3,
          },
          emphasis: {
            focus: "adjacency",
            lineStyle: {
              width: 4,
            },
          },
        },
      ],
    };
  };

  // 缓存点击事件处理函数
  const handleChartClick = useCallback(
    (params: any) => {
      if (params.dataType === "node") {
        const nodeName = params.name;
        const relatedTriples = data.find((item) => item.object === nodeName);
        onNodeClick?.(relatedTriples);
      } else if (params.dataType === "edge") {
        const target = (params.data as { target: string }).target;
        const relatedTriples = data.find((item) => item.object === target);
        onNodeClick?.(relatedTriples);
      }
    },
    [data, onNodeClick]
  );

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current);
    chartInstance.current.setOption(getOption());

    // 使用缓存的点击事件处理函数
    chartInstance.current.on("click", handleChartClick);

    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      chartInstance.current?.off("click");
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, [data]); // 只在 data 变化时重新初始化图表

  return <div ref={chartRef} style={{ width: "100%", height: "600px" }} />;
}
