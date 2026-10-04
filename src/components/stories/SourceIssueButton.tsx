"use client";

export function SourceIssueButton({ storyTitle, sourceTitle, sourceUrl }: { storyTitle: string; sourceTitle: string; sourceUrl: string }) {
  const reportIssue = () => {
    window.dispatchEvent(new CustomEvent("open-feedback", {
      detail: {
        prefill: `来源链接可能失效\n故事：${storyTitle}\n来源：${sourceTitle}\n链接：${sourceUrl}\n补充说明：`,
      },
    }));
  };

  return <button type="button" onClick={reportIssue}>报告链接失效</button>;
}
