interface DefaultExceptionProps {
  message: string;
  code: string;
  status: number;
  stack?: string;
  data?: unknown;
}

export type ExceptionInput = Omit<DefaultExceptionProps, 'status'>;

export class DefaultException extends Error implements DefaultExceptionProps {
  readonly code: string;
  readonly status: number;
  readonly data?: unknown;

  constructor(props: DefaultExceptionProps) {
    const { message, code, status, data, stack } = props;

    super(message);
    this.name = code;
    this.status = status;
    this.code = code;
    this.data = data;
    this.stack = stack;
  }
}
