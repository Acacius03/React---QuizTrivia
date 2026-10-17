interface Props {
  className?: string;
  correctCount: number;
  incorrectCount: number;
}
export default function App({
  className,
  correctCount,
  incorrectCount,
}: Props) {
  return (
    <div className={"flex gap-2 " + className}>
      <span id="success" className="text-green-400">
        {correctCount}
      </span>
      <span>/</span>
      <span id="fail" className="text-red-400">
        {incorrectCount}
      </span>
    </div>
  );
}
