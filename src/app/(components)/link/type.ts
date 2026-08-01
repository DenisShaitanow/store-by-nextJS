type TLinkVariant = "primary" | "secondary" | "inline";

interface BaseProps {
  children: React.ReactNode;
  className?: string;
  variant?: TLinkVariant;
  disabled?: boolean;
}

interface InternalLinkProps extends BaseProps {
  to: string;
  external?: false;
}

interface ExternalLinkProps extends BaseProps {
  href: string;
  external: true;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}

type TProps = InternalLinkProps | ExternalLinkProps;

export type { TLinkVariant, TProps };
