"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Clock,
  FileText,
  CheckCircle,
  TrendingUp,
  Award,
  Target,
  Lightbulb,
} from "lucide-react";
import type { MonthlyReport as MonthlyReportType } from "@/lib/analytics/report-generator";
import { useLocalUser } from "@/lib/identity/user-provider";

interface MonthlyReportProps {
  date: Date;
}

export function MonthlyReport({ date }: MonthlyReportProps) {
  const { userId, ready } = useLocalUser();
  const [report, setReport] = useState<MonthlyReportType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready || !userId) return;
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const qs = new URLSearchParams({
          userId,
          date: date.toISOString(),
        });
        const res = await fetch(`/api/analytics/monthly-report?${qs}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as MonthlyReportType;
        if (!cancelled) setReport(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setReport(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [date, userId, ready]);

  if (loading || !report) {
    return <div className="text-center py-8">{loading ? "加载中..." : "暂无月报数据"}</div>;
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
  };

  const weeklyChartData = (report.weeklyTrend || []).map((week) => ({
    week: `第${week.week}周`,
    学习时长: week.studyTime,
    活动次数: week.activities,
  }));

  const radarData = report.knowledgeMastery.map((km) => ({
    subject: km.name,
    掌握度: km.mastery,
  }));

  return (
    <div className="space-y-6">
      {/* 报告标题 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{report.period.month} 学习报告</CardTitle>
          <p className="text-sm text-muted-foreground">
            {report.period.start} 至 {report.period.end}
          </p>
        </CardHeader>
      </Card>

      {/* 核心指标 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总学习时长</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(report.summary.totalStudyTime)}
            </div>
            <p className="text-xs text-muted-foreground">
              日均 {formatTime(report.summary.avgDailyTime)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">文档活动</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {report.summary.documentsCreated + report.summary.documentsEdited}
            </div>
            <p className="text-xs text-muted-foreground">
              创建 {report.summary.documentsCreated} / 编辑{" "}
              {report.summary.documentsEdited}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">练习完成</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {report.summary.practicesCompleted}
            </div>
            <p className="text-xs text-muted-foreground">
              正确率 {report.summary.practiceAccuracy}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">知识点掌握</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {report.summary.knowledgePointsMastered}
            </div>
            <p className="text-xs text-muted-foreground">已掌握知识点</p>
          </CardContent>
        </Card>
      </div>

      {/* 周趋势图 */}
      <Card>
        <CardHeader>
          <CardTitle>月度学习趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="week"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="学习时长"
                fill="hsl(15, 86%, 65%)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 知识点掌握雷达图 */}
      <Card>
        <CardHeader>
          <CardTitle>知识点掌握度</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="subject"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
              />
              <Radar
                name="掌握度"
                dataKey="掌握度"
                stroke="hsl(15, 86%, 65%)"
                fill="hsl(15, 86%, 65%)"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 活动分布 */}
      <Card>
        <CardHeader>
          <CardTitle>学习活动分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {report.topActivities.map((activity, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{activity.type}</span>
                  <span className="text-muted-foreground">
                    {formatTime(activity.duration)} ({activity.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${activity.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 里程碑和成就 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              月度里程碑
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.milestones.map((milestone, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>{milestone}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              月度成就
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {report.achievements.map((achievement, index) => (
                <Badge key={index} variant="secondary" className="mr-2">
                  {achievement}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 洞察和建议 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              学习洞察
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.insights.map((insight, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>下月计划建议</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
