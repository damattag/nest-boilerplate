interface BuildResponseMetaInput {
  limit: number;
  listed: number;
  page: number;
  total: number;
}

export function buildResponseMeta(input: BuildResponseMetaInput) {
  const { limit, listed, page, total } = input;

  const totalPages = Math.ceil(total / limit);

  return {
    listed,
    total,
    page,
    totalPages: totalPages === 0 ? 1 : totalPages,
  };
}
