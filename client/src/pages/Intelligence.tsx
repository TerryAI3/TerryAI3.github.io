import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Shield, Rocket, Activity, Globe, GraduationCap, Briefcase } from "lucide-react";

const agents = [
  {
    name: "东来哥 (Main)",
    role: "主控枢纽 & 统筹调度",
    model: "Gemini 3 Flash",
    status: "Online",
    description: "负责多智能体协同、全局任务规划与语音交互中控。",
    icon: Shield,
    color: "bg-blue-500",
  },
  {
    name: "极客 (Geek)",
    role: "技术架构 & 基础设施",
    model: "DeepSeek Chat",
    status: "Online",
    description: "专注代码优化、CDN加速、自动化脚本与网络安全。",
    icon: Rocket,
    color: "bg-purple-500",
  },
  {
    name: "伙伴 (Partner/老马)",
    role: "商务情报 & 行业分析",
    model: "DeepSeek Chat",
    status: "Online",
    description: "精通招投标、供应链管理与全网商业动态追踪。",
    icon: Briefcase,
    color: "bg-green-500",
  },
  {
    name: "孔奇塔 (Conchita)",
    role: "网球执教 & 战术分析",
    model: "Gemini Flash",
    status: "Online",
    description: "专业网球教练视角，负责青少年训练规划与赛事分析。",
    icon: Brain,
    color: "bg-orange-500",
  }
];

const Intelligence: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">数字化特种部队</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          基于多智能体架构的佐迪智库，实时响应业务、技术与学业需求。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {agents.map((agent) => (
          <Card key={agent.name} className="hover:shadow-lg transition-all border-t-4 border-t-primary/20">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className={`${agent.color} p-2 rounded-lg text-white`}>
                  <agent.icon size={24} />
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Activity size={12} className="mr-1 animate-pulse" />
                  {agent.status}
                </Badge>
              </div>
              <CardTitle className="mt-4">{agent.name}</CardTitle>
              <CardDescription className="font-medium text-primary/80">{agent.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {agent.description}
              </p>
              <div className="text-xs font-mono bg-muted p-2 rounded">
                Kernel: {agent.model}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Progress */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <GraduationCap className="text-primary" />
              学业进展: HKMU 8099
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>专业培训 (Training)</span>
                <span>70% (含已安排)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-[70%]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>面对面咨询 (Consultation)</span>
                <span>50%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-[50%]"></div>
              </div>
            </div>

            <div className="pt-4 border-t border-dashed">
              <h4 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">关键节点备忘</h4>
              <ul className="text-sm space-y-3">
                <li className="flex items-start gap-2">
                  <Badge variant="secondary">04-19</Badge>
                  <span><b>第三次咨询</b>: 地点 B0614 (Sam's Rule: 一天一卡)</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <Badge variant="outline">05-16</Badge>
                  <span>中期汇报: 09:20 - 09:40 (最高优先级)</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Global Insights */}
        <Card className="h-full bg-slate-50 border-none shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Globe className="text-blue-600" />
              全球时事 & 行业情报
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-bold text-sm mb-2 text-orange-600">地缘政治风险</h4>
              <p className="text-sm leading-relaxed">
                美、以、伊达成脆弱停火协议，德黑兰空袭疑云尚存。全球供应链面临波动风险，需增加物流备份。
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-bold text-sm mb-2 text-blue-600">智能家居趋势</h4>
              <p className="text-sm leading-relaxed">
                2026年市场痛点转向“围墙花园”突破。品牌互联互通不畅仍是主要障碍，跨品牌整合方案是新机会点。
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-bold text-sm mb-2 text-green-600">网球技术洞察</h4>
              <p className="text-sm leading-relaxed">
                10岁年龄段进入“动作学习金子期”。训练强调质量而非单纯苦练，发球稳定性与网前意识是打磨重点。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Intelligence;
