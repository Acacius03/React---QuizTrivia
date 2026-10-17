import { Menu } from "lucide-react";

interface Props {
  className?: string;
  onToggleMenu: () => void;
}
export default function Header({ onToggleMenu }: Props) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <h1 className="text-4xl font-bold">
        <span className="text-purple-500">Trivial</span>{" "}
        <span className="text-amber-300">XD</span>
      </h1>

      <button
        onClick={onToggleMenu}
        className="h-12 w-12 content-center rounded-xl bg-blue-950"
      >
        <Menu className="m-auto" />
      </button>
    </div>
  );
}
