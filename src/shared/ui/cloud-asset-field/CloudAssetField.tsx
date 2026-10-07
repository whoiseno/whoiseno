import { Button } from "@keystar/ui/button";
import { FieldPrimitive } from "@keystar/ui/field";
import { Flex } from "@keystar/ui/layout";
import { ProgressCircle } from "@keystar/ui/progress";
import { tokenSchema } from "@keystar/ui/style";
import { Text } from "@keystar/ui/typography";
import type { BasicFormField, FormFieldStoredValue, JsonYamlValue } from "@keystatic/core";
import { useRef, useState } from "react";

import { cloudImageUrl, isCloudAsset, type TypeCloudAsset } from "../../lib/cloud-asset";

export type TypeCloudAssetKind = "image" | "video" | "audio";

/** An upload on Cloudinary, or the path of a file saved in the repository before uploads moved there. */
export type TypeCloudAssetValue = TypeCloudAsset | string | null;

const accept: Record<TypeCloudAssetKind, string> = { image: "image/*", video: "video/*", audio: "audio/*" };
// Cloudinary files an audio clip under video.
const resourceType: Record<TypeCloudAssetKind, string> = { image: "image", video: "video", audio: "video" };

function read(stored: FormFieldStoredValue): TypeCloudAssetValue {
  if (typeof stored === "string") return stored;
  if (!isCloudAsset(stored)) return null;
  const { url, width, height } = stored;
  return { url, ...(typeof width === "number" && { width }), ...(typeof height === "number" && { height }) };
}

function write(value: TypeCloudAssetValue): FormFieldStoredValue {
  if (!isCloudAsset(value)) return value ?? undefined;
  const stored: { [key: string]: JsonYamlValue } = { url: value.url };
  if (value.width !== undefined) stored.width = value.width;
  if (value.height !== undefined) stored.height = value.height;
  return stored;
}

/** The token the Keystatic admin keeps in the browser after a Cloud sign-in. There is none under local storage. */
function cloudToken() {
  try {
    const stored = JSON.parse(localStorage.getItem("keystatic-cloud-access-token") ?? "null");
    return typeof stored?.token === "string" ? stored.token : undefined;
  } catch {
    return undefined;
  }
}

/** Asks the site to sign the upload, then sends the file straight to Cloudinary. */
async function upload(file: File, folder: string, kind: TypeCloudAssetKind): Promise<TypeCloudAsset> {
  const token = cloudToken();
  const signed = await fetch("/api/cloud-assets/sign", {
    method: "POST",
    headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ folder }),
  });
  const signature = await signed.json().catch(() => null);
  if (!signed.ok) throw new Error(signature?.error ?? `The site could not sign the upload (${signed.status}).`);

  const form = new FormData();
  for (const [key, value] of Object.entries(signature.params)) form.append(key, String(value));
  form.append("file", file);
  const response = await fetch(signature.uploadUrl, { method: "POST", body: form });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.error?.message ?? `Cloudinary refused the upload (${response.status}).`);
  if (result.resource_type !== resourceType[kind])
    throw new Error(`That file is not ${kind === "image" ? "an" : "a"} ${kind}.`);

  return kind === "image"
    ? { url: result.secure_url, width: result.width, height: result.height }
    : { url: result.secure_url };
}

/** What the editor shows for an uploaded image, in place of a bare label. A function, not a component, so the config file needs no JSX. */
export function cloudImagePreview(asset: TypeCloudAssetValue, label: string) {
  if (!isCloudAsset(asset)) return label;
  return (
    <img
      alt=""
      src={cloudImageUrl(asset.url, { width: 640 })}
      style={{ display: "block", maxHeight: 240, maxWidth: "100%", borderRadius: tokenSchema.size.radius.regular }}
    />
  );
}

function Preview({ kind, value }: { kind: TypeCloudAssetKind; value: TypeCloudAssetValue }) {
  if (typeof value === "string") {
    return (
      <Text
        color="neutralSecondary"
        size="small"
      >
        Saved in the repository as {value}. Upload a file to move it to Cloudinary.
      </Text>
    );
  }
  if (!value) return null;
  const style = { maxHeight: 200, maxWidth: "100%", borderRadius: tokenSchema.size.radius.regular };
  if (kind === "video")
    return (
      <video
        controls
        preload="metadata"
        src={value.url}
        style={style}
      />
    );
  if (kind === "audio")
    return (
      <audio
        controls
        preload="metadata"
        src={value.url}
        style={{ maxWidth: "100%" }}
      />
    );
  return (
    <img
      alt=""
      src={cloudImageUrl(value.url, { width: 320 })}
      style={{ ...style, border: `1px solid ${tokenSchema.color.border.neutral}`, objectFit: "contain" }}
    />
  );
}

function CloudAssetInput(props: {
  description?: string;
  folder: string;
  kind: TypeCloudAssetKind;
  label: string;
  onChange(value: TypeCloudAssetValue): void;
  value: TypeCloudAssetValue;
}) {
  const { description, folder, kind, label, onChange, value } = props;
  const picker = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function choose(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(undefined);
    try {
      onChange(await upload(file, folder, kind));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <FieldPrimitive
      description={description}
      errorMessage={error}
      label={label}
    >
      <Flex
        direction="column"
        gap="regular"
      >
        <Preview
          kind={kind}
          value={value}
        />
        <Flex
          alignItems="center"
          gap="regular"
        >
          <input
            ref={picker}
            accept={accept[kind]}
            hidden
            onChange={(event) => {
              void choose(event.currentTarget.files?.[0]);
              // So that choosing the same file again still fires `change`.
              event.currentTarget.value = "";
            }}
            type="file"
          />
          <Button
            isDisabled={busy}
            onPress={() => picker.current?.click()}
          >
            {value ? "Replace" : `Upload ${kind}`}
          </Button>
          {value && (
            <Button
              isDisabled={busy}
              onPress={() => onChange(null)}
              prominence="low"
              tone="critical"
            >
              Remove
            </Button>
          )}
          {busy && (
            <ProgressCircle
              aria-label="Uploading"
              isIndeterminate
              size="small"
            />
          )}
        </Flex>
      </Flex>
    </FieldPrimitive>
  );
}

/**
 * A Keystatic field that uploads the file to Cloudinary and stores `{ url, width, height }` in the entry, instead of
 * writing the file into the repository. A path saved by the old image and file fields is kept as it is until a new file
 * replaces it.
 */
export function cloudAssetField(options: {
  description?: string;
  /** Where the upload goes in Cloudinary, below the `whoiseno` folder. */
  folder: string;
  kind: TypeCloudAssetKind;
  label: string;
}): BasicFormField<TypeCloudAssetValue> {
  return {
    kind: "form",
    label: options.label,
    Input: ({ value, onChange }) => (
      <CloudAssetInput
        {...options}
        onChange={onChange}
        value={value}
      />
    ),
    defaultValue: () => null,
    parse: read,
    serialize: (value) => ({ value: write(value) }),
    validate: (value) => value,
    reader: { parse: read },
  };
}
