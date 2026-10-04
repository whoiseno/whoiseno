import ArrowLeft from "reicon-astro/icons/ArrowLeft.astro";
import ArrowRight from "reicon-astro/icons/ArrowRight.astro";
import ArrowUpRight from "reicon-astro/icons/ArrowUpRight.astro";
import Check from "reicon-astro/icons/Check.astro";
import ChevronDown from "reicon-astro/icons/ChevronDown.astro";
import Compress from "reicon-astro/icons/Compress.astro";
import Copy from "reicon-astro/icons/Copy.astro";
import Envelope from "reicon-astro/icons/Envelope.astro";
import Expand from "reicon-astro/icons/Expand.astro";
import Eye from "reicon-astro/icons/Eye.astro";
import Menu from "reicon-astro/icons/Menu.astro";
import Moon from "reicon-astro/icons/Moon.astro";
import Star from "reicon-astro/icons/Star.astro";
import Sun from "reicon-astro/icons/Sun.astro";
import Verified from "reicon-astro/icons/Verified.astro";
import X from "reicon-astro/icons/X.astro";

/**
 * Curated Reicon set. Each icon is imported by path: the package barrel pulls in all ~2,700 components,
 * which makes the dev server compile every one of them.
 */
export const reicons = {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Compress,
  Copy,
  Envelope,
  Expand,
  Eye,
  Menu,
  Moon,
  Star,
  Sun,
  Verified,
  X,
};

export type TypeReiconName = keyof typeof reicons;
