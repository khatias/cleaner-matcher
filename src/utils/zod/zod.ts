import { z } from "zod";

export type FlatErrors = {
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
};

type ZodTreeNode = {
  errors?: string[];
  properties?: Record<string, ZodTreeNode>;
  items?: Array<ZodTreeNode | undefined>;
};

function flattenTree(
  node: ZodTreeNode,
  prefix = "",
  acc?: FlatErrors
): FlatErrors {
  const out = acc ?? { formErrors: [], fieldErrors: {} };

  if (node.errors?.length) {
    if (prefix) {
      (out.fieldErrors[prefix] ??= []).push(...node.errors);
    } else {
      out.formErrors.push(...node.errors);
    }
  }

  if (node.properties) {
    for (const [key, child] of Object.entries(node.properties)) {
      const path = prefix ? `${prefix}.${key}` : key;
      flattenTree(child, path, out);
    }
  }

  if (Array.isArray(node.items)) {
    node.items.forEach((child, i) => {
      if (!child) return;
      const path = `${prefix}[${i}]`;
      flattenTree(child, path, out);
    });
  }

  return out;
}

export function extractFlatErrors(err: z.ZodError): FlatErrors {
  const anyZ = z as unknown as {
    treeifyError?: (e: z.ZodError) => ZodTreeNode;
  };
  if (typeof anyZ.treeifyError === "function") {
    const tree = anyZ.treeifyError(err);
    return flattenTree(tree);
  }

  const formErrors: string[] = [];
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of err.issues) {
    if (issue.path.length) {
      const path = issue.path
        .map((seg) => (typeof seg === "number" ? `[${seg}]` : seg))
        .join(".")
        .replace(/\.\[/g, "[");
      (fieldErrors[path] ??= []).push(issue.message);
    } else {
      formErrors.push(issue.message);
    }
  }

  return { formErrors, fieldErrors };
}

export function summarize(errs: FlatErrors): string | undefined {
  if (errs.formErrors.length) return errs.formErrors[0];
  if (Object.keys(errs.fieldErrors).length > 0) return undefined;
  return "Please fix the errors and try again.";
}
