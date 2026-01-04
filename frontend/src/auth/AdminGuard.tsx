import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AdminGuard({ children }: Props) {
  return <>{children}</>;
}
