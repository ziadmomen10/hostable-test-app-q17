/**
 * Legal Content Renderer
 *
 * Renders structured legal content — headings, paragraphs, lists, banners.
 * Each element is editable via EditableElement / EditableInline.
 *
 * Internal structure:
 *   renderText()       — highlights [[text]] in green
 *   renderBoldColon()  — splits "Key: value" into bold key + plain value
 *   <PlainList />      — plain (non-bulleted) key-value list
 *   <NestedListItem /> — bullet item that may have nested sub-bullets
 *   <BulletList />     — bulleted list, optional grey box
 *   <LegalTable />     — bordered table with optional multi-paragraph cells
 *   <FaqList />        — static FAQ accordion rows (visual-only, questions only)
 */

import React from 'react';
import type { LegalContentSection, LegalListItem } from '@/types/newSectionTypes';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { InfoIcon, ChevronDown } from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────────────────────
// renderText: highlights [[text]] in green; renderBoldColon: splits "Key: value" into bold key + plain value
// isBoldColonPattern: true when the key before ": " is a short title (≤5 words) — avoids triggering on mid-sentence colons like "(EX: ...)"

function isBoldColonPattern(text: string): boolean {
  const ci = text.indexOf(': ');
  if (ci === -1) return false;
  const key = text.slice(0, ci);
  const wordCount = key.trim().split(/\s+/).length;
  return wordCount <= 8 && !key.startsWith('(');
}

function renderText(text: string): React.ReactNode {
  const parts = text.split(/(\[\[.*?\]\])/g);
  if (parts.length === 1) return text;
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('[[') && part.endsWith(']]')
          ? <span key={i} className="text-colors-primary-800">{part.slice(2, -2)}</span>
          : part
      )}
    </>
  );
}

function renderBoldColon(
  text: string,
  boldClass = 'font-[Satoshi] text-[16px] font-medium leading-[175%] text-[#555]',
  restClass = 'font-[Satoshi] text-[16px] font-normal leading-[175%] text-[#555]',
): React.ReactNode {
  const colonIdx = text.indexOf(': ');
  if (colonIdx === -1) return renderText(text);
  return (
    <>
      <span className={boldClass}>{text.slice(0, colonIdx)}:</span>
      <span className={restClass}>{text.slice(colonIdx + 1)}</span>
    </>
  );
}

// ─── Shared edit context passed down to all sub-components ───────────────────

interface EditContext {
  sectionId?: string;
  basePath: string;
  sectionIndex: number;
}

// ─── PlainList ────────────────────────────────────────────────────────────────

interface PlainListProps extends EditContext {
  items: (string | LegalListItem)[];
}

const PlainList: React.FC<PlainListProps> = ({ items, sectionId, basePath, sectionIndex }) => (
  <div className="flex flex-col gap-1 text-base leading-[1.75]">
    {items.map((listItem, i) => {
      const text = typeof listItem === 'string' ? listItem : (listItem as LegalListItem).text;
      const colonIdx = text.indexOf(': ');
      return (
        <div key={`plain-${sectionIndex}-${i}`}>
          {colonIdx !== -1 ? (
            <>
              <span className="font-bold text-colors-neutral-600">{text.slice(0, colonIdx)}</span>
              <span className="text-colors-neutral-800">{text.slice(colonIdx)}</span>
            </>
          ) : (
            <EditableInline sectionId={sectionId} path={`${basePath}.${sectionIndex}.lists.items.${i}`}>
              {renderText(text)}
            </EditableInline>
          )}
        </div>
      );
    })}
  </div>
);

// ─── NestedListItem ───────────────────────────────────────────────────────────

interface NestedListItemProps extends EditContext {
  item: LegalListItem;
  itemIndex: number;
  boldTitles: boolean;
}

const NestedListItem: React.FC<NestedListItemProps> = ({
  item, itemIndex, boldTitles, sectionId, basePath, sectionIndex,
}) => {
  const subItems = item.subItems ?? [];
  const firstIsIntro =
    subItems.length > 0 &&
    (subItems[0].trimEnd().endsWith(':') || (boldTitles && subItems.length === 1));
  const bulletItems = firstIsIntro ? subItems.slice(1) : subItems;

  return (
    <>
      <EditableInline
        sectionId={sectionId}
        path={`${basePath}.${sectionIndex}.lists.items.${itemIndex}.text`}
      >
        {boldTitles
          ? <span className="text-[16px] font-medium leading-[175%] text-[#262626]">{renderText(item.text)}</span>
          : renderText(item.text)
        }
      </EditableInline>

      {subItems.length > 0 && (
        <div className="mt-1">
          {firstIsIntro && (
            <EditableInline
              sectionId={sectionId}
              path={`${basePath}.${sectionIndex}.lists.items.${itemIndex}.subItems.0`}
            >
              <p className="text-colors-neutral-600 mb-2">{renderText(subItems[0])}</p>
            </EditableInline>
          )}
          {bulletItems.length > 0 && (
            <ul className="list-disc pl-6 space-y-1">
              {bulletItems.map((subItem, subIndex) => {
                const actualIndex = firstIsIntro ? subIndex + 1 : subIndex;
                const showBold = boldTitles && subItem.includes(': ');
                return (
                  <li key={`sublist-${sectionIndex}-${itemIndex}-${actualIndex}`}>
                    {showBold ? (
                      renderBoldColon(subItem, 'font-[Satoshi] text-[16px] font-medium leading-[175%] text-[#555]', 'font-[Satoshi] text-[16px] font-normal leading-[175%] text-[#555]')
                    ) : (
                      <EditableInline
                        sectionId={sectionId}
                        path={`${basePath}.${sectionIndex}.lists.items.${itemIndex}.subItems.${actualIndex}`}
                      >
                        {renderText(subItem)}
                      </EditableInline>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

// ─── LegalTable ──────────────────────────────────────────────────────────────

interface LegalTableProps extends EditContext {
  headers: string[];
  rows: { cells: (string | string[])[] }[];
}

const LegalTable: React.FC<LegalTableProps> = ({ headers, rows, sectionId, basePath, sectionIndex }) => (
  <div className="overflow-hidden rounded-lg border border-colors-neutral-200">
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-colors-neutral-200">
          {headers.map((header, hi) => (
            <th
              key={`th-${sectionIndex}-${hi}`}
              className={`px-5 py-4 font-[Satoshi] text-[16px] font-medium leading-[175%] text-[#262626] ${hi === 0 ? 'w-1/5 border-r border-colors-neutral-200' : ''}`}
            >
              <EditableInline
                sectionId={sectionId}
                path={`${basePath}.${sectionIndex}.table.headers.${hi}`}
              >
                {header}
              </EditableInline>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-colors-neutral-200">
        {rows.map((row, ri) => (
          <tr key={`tr-${sectionIndex}-${ri}`} className="align-top">
            {row.cells.map((cell, ci) => (
              <td
                key={`td-${sectionIndex}-${ri}-${ci}`}
                className={`px-5 py-4 font-[Satoshi] text-[16px] font-normal leading-[175%] text-[#555] ${ci === 0 ? 'w-1/5 border-r border-colors-neutral-200' : ''}`}
              >
                {Array.isArray(cell) ? (
                  cell.map((para, pi) => (
                    <EditableInline
                      key={`td-para-${sectionIndex}-${ri}-${ci}-${pi}`}
                      sectionId={sectionId}
                      path={`${basePath}.${sectionIndex}.table.rows.${ri}.cells.${ci}.${pi}`}
                    >
                      <p className={pi < cell.length - 1 ? 'mb-2' : ''}>{renderText(para)}</p>
                    </EditableInline>
                  ))
                ) : (
                  <EditableInline
                    sectionId={sectionId}
                    path={`${basePath}.${sectionIndex}.table.rows.${ri}.cells.${ci}`}
                  >
                    {renderText(cell)}
                  </EditableInline>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── FaqList ─────────────────────────────────────────────────────────────────

interface FaqListProps extends EditContext {
  items: { question: string }[];
}

const FaqList: React.FC<FaqListProps> = ({ items, sectionId, basePath, sectionIndex }) => (
  <div className="divide-y divide-colors-neutral-200">
    {items.map((item, i) => (
      <div key={`faq-${sectionIndex}-${i}`} className="flex justify-between items-center py-4">
        <EditableInline
          sectionId={sectionId}
          path={`${basePath}.${sectionIndex}.faq.${i}.question`}
        >
          <span className="font-[Satoshi] text-[16px] font-medium leading-[175%] text-[#262626]">{item.question}</span>
        </EditableInline>
        <ChevronDown className="flex-shrink-0 ml-4 w-5 h-5 text-colors-neutral-800" />
      </div>
    ))}
  </div>
);

// ─── BulletList ───────────────────────────────────────────────────────────────

interface BulletListProps extends EditContext {
  items: (string | LegalListItem)[];
  noBox?: boolean;
  boldNestedTitles: boolean;
}

const BulletList: React.FC<BulletListProps> = ({
  items, noBox, boldNestedTitles, sectionId, basePath, sectionIndex,
}) => (
  <div className={noBox ? '' : 'bg-colors-neutral-50 rounded px-6 py-4 border-l-4 border-colors-neutral-400/40'}>
    <ul className="list-disc pl-4 text-base text-colors-neutral-600 leading-[1.75] space-y-2">
      {items.map((listItem, i) => (
        <li key={`bullet-${sectionIndex}-${i}`}>
          {typeof listItem === 'string' ? (
            isBoldColonPattern(listItem) ? (
              renderBoldColon(listItem)
            ) : (
              <EditableInline sectionId={sectionId} path={`${basePath}.${sectionIndex}.lists.items.${i}`}>
                {renderText(listItem)}
              </EditableInline>
            )
          ) : (
            <NestedListItem
              item={listItem as LegalListItem}
              itemIndex={i}
              boldTitles={boldNestedTitles}
              sectionId={sectionId}
              basePath={basePath}
              sectionIndex={sectionIndex}
            />
          )}
        </li>
      ))}
    </ul>
  </div>
);

// ─── Main Renderer ────────────────────────────────────────────────────────────

interface LegalContentRendererProps {
  sections: LegalContentSection[];
  sectionId?: string;
  itemIndex?: number;
  className?: string;
  boldNestedTitles?: boolean;
}

export const LegalContentRenderer: React.FC<LegalContentRendererProps> = ({
  sections,
  sectionId,
  itemIndex = 0,
  className = '',
  boldNestedTitles = false,
}) => {
  const basePath = `items.${itemIndex}.sections`;

  return (
    <div className={`flex flex-col gap-12 font-[Satoshi] ${className}`}>
      {sections.map((section, sectionIndex) => {
        const prevSection = sectionIndex > 0 ? sections[sectionIndex - 1] : null;
        const isGreyBox = !section.heading && !!section.lists && !section.banner;
        const prevIsGreyBox = !!prevSection && !prevSection.heading && !!prevSection.lists && !prevSection.banner;
        const editCtx: EditContext = { sectionId, basePath, sectionIndex };

        return (
          <div
            key={`section-${sectionIndex}`}
            className={`flex flex-col ${section.isSubSection ? 'gap-2' : 'gap-6'}${isGreyBox && prevIsGreyBox ? ' -mt-8' : ''}`}
          >
            {section.lastRevised && (
              <EditableInline
                sectionId={sectionId}
                path={`${basePath}.${sectionIndex}.lastRevised`}
              >
                <p className="text-base leading-[1.75]">
                  <span className="text-[16px] font-medium leading-[175%] text-[#262626]">Last Revised:</span>
                  <span className="text-colors-neutral-600"> {section.lastRevised}</span>
                </p>
              </EditableInline>
            )}

            {section.heading && (
              <EditableElement
                as="h4"
                sectionId={sectionId}
                path={`${basePath}.${sectionIndex}.heading`}
                className={section.isSubSection
                  ? 'text-[16px] font-medium leading-[175%] text-[#262626]'
                  : 'font-[Satoshi] text-[24px] font-medium leading-[134%] text-[#262626]'
                }
              >
                {section.heading}
              </EditableElement>
            )}

            {section.paragraphs && section.paragraphs.length > 0 && (
              <div className="flex flex-col gap-[16px] font-[Satoshi] text-[16px] font-normal text-[#555] leading-[175%]">
                {section.paragraphs.map((paragraph, pIndex) => (
                  <EditableElement
                    key={`para-${sectionIndex}-${pIndex}`}
                    as="p"
                    sectionId={sectionId}
                    path={`${basePath}.${sectionIndex}.paragraphs.${pIndex}`}
                  >
                    {isBoldColonPattern(paragraph) ? renderBoldColon(paragraph) : renderText(paragraph)}
                  </EditableElement>
                ))}
              </div>
            )}

            {section.lists && section.lists.items.length > 0 && (
              section.lists.plain ? (
                <PlainList items={section.lists.items} {...editCtx} />
              ) : (
                <BulletList
                  items={section.lists.items}
                  noBox={section.lists.noBox}
                  boldNestedTitles={boldNestedTitles}
                  {...editCtx}
                />
              )
            )}

            {section.table && section.table.rows.length > 0 && (
              <LegalTable
                headers={section.table.headers}
                rows={section.table.rows}
                {...editCtx}
              />
            )}

            {section.faq && section.faq.length > 0 && (
              <FaqList items={section.faq} {...editCtx} />
            )}

            {section.trailingParagraphs && section.trailingParagraphs.length > 0 && (
              <div className="flex flex-col gap-[16px] font-[Satoshi] text-[16px] font-normal text-[#555] leading-[175%]">
                {section.trailingParagraphs.map((paragraph, pIndex) => (
                  <EditableElement
                    key={`trailing-${sectionIndex}-${pIndex}`}
                    as="p"
                    sectionId={sectionId}
                    path={`${basePath}.${sectionIndex}.trailingParagraphs.${pIndex}`}
                  >
                    {isBoldColonPattern(paragraph) ? renderBoldColon(paragraph) : renderText(paragraph)}
                  </EditableElement>
                ))}
              </div>
            )}

            {section.banner && (
              <div
                className="border border-colors-primary-500/20 rounded-3xl p-6 flex gap-4 items-start"
                style={{ backgroundColor: 'rgba(156, 183, 81, 0.16)' }}
              >
                <div className="flex-shrink-0 w-6 h-6 text-colors-primary-800">
                  <InfoIcon className="w-full h-full" />
                </div>
                <EditableElement
                  as="p"
                  sectionId={sectionId}
                  path={`${basePath}.${sectionIndex}.banner`}
                  className="text-base text-colors-primary-800 leading-[1.75]"
                >
                  {section.banner}
                </EditableElement>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LegalContentRenderer;
