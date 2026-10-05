/** One step of a page's trail. The last step is the current page and has no `href`. */
export interface TypeCrumb {
  label: string;
  href?: string;
}
