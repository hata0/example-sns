import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { TasksList } from "./list";

export const Tasks = () => {
  return (
    <ErrorBoundary fallback={<div>タスクの取得に失敗しました</div>}>
      <Suspense fallback={<div>ロード中</div>}>
        <TasksList />
      </Suspense>
    </ErrorBoundary>
  );
};
