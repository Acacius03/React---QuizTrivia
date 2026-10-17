interface Props {
  className?: string;
  quizNumber: number;
}
export default function QuizNumber({ className, quizNumber }: Props) {
  return (
    <p className={className}>
      Question <span id="quiz-number">{quizNumber + 1}</span>
    </p>
  );
}
