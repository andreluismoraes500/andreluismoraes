// Os componentes do React Bits são .jsx; aqui eles ganham tipos "soltos"
// para o TypeScript não exigir props opcionais (container, style, onStart...).
declare module "@/components/*" {
  import type { ComponentType } from "react";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component: ComponentType<any>;
  export default Component;
}
