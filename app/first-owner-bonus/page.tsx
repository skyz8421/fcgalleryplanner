import Link from "@/components/SiteLink";
import PageShell from "@/components/PageShell";
import { pageMetadata } from "@/lib/site";

const description = "Calculate FC 27 Gallery First Owner bonuses from the matching item subtotal, with tier examples and checks for unexpected scores.";
export const metadata = pageMetadata("FC 27 Gallery First Owner bonus", description, "/first-owner-bonus/");

export default function FirstOwnerBonusPage() {
  return (
    <PageShell title="Calculate the First Owner bonus" description={description} path="/first-owner-bonus/">
      <div className="prose">
        <p>First Owner rewards qualifying items in a set. To estimate its bonus, count those items and add their Item Scores. Apply the tier percentage to that matching subtotal, then add the bonus to the set&apos;s base score.</p>
        <img src="/first-owner-flow.svg" width={900} height={240} alt="Collection items build a set; qualifying tag groups add bonuses to its base score before the set is graded." />

        <h2>The First Owner tiers</h2>
        <p>Use the tier that matches the number of eligible First Owner items in a set that offers this tag.</p>
        <div className="table-scroll" tabIndex={0} role="region" aria-label="Scrollable Gallery reference table">
          <table className="data-table">
            <caption>First Owner item counts and bonuses</caption>
            <thead><tr><th scope="col">Matching items</th><th scope="col">Bonus</th><th scope="col">Matching subtotal plus this bonus</th></tr></thead>
            <tbody>
              <tr><th scope="row">Fewer than 5</th><td>No First Owner tier</td><td>1×</td></tr>
              <tr><th scope="row">5–9</th><td>+150%</td><td>2.5×</td></tr>
              <tr><th scope="row">10–19</th><td>+300%</td><td>4×</td></tr>
              <tr><th scope="row">20 or more</th><td>+500%</td><td>6×</td></tr>
            </tbody>
          </table>
        </div>
        <p>The multiplier in the last column describes those matching items with this one bonus. It is not a multiplier for the whole set when some items are not First Owner.</p>

        <h2>Five First Owner items with a subtotal of 1,000</h2>
        <div className="example">
          <p>Suppose five eligible First Owner items have a combined Item Score of 1,000. Other items in the set contribute 5,000. The set&apos;s base score is 6,000.</p>
          <p><strong>First Owner bonus:</strong> 1,000 × 150% = 1,500.</p>
          <p><strong>Base plus this bonus:</strong> 6,000 + 1,500 = 7,500.</p>
          <p>Multiplying the whole 6,000 by 150% would give a 9,000 bonus and overstate the result. Only the 1,000 matching subtotal qualifies.</p>
        </div>
        <p>Enter the 6,000 base score and the 1,000 matching subtotal in the <Link href="/gallery-score-calculator/">Gallery score checker</Link>. Add other eligible tags separately rather than adding their bonuses into the First Owner subtotal.</p>

        <h2>What crossing a tier changes</h2>
        <p>For a clean arithmetic example, use ordinary 83-rated base items worth 410 Item Score each. Assume all items qualify as First Owner, the set allows the tag and no other bonuses are counted.</p>
        <div className="table-scroll" tabIndex={0} role="region" aria-label="Scrollable Gallery reference table">
          <table className="data-table">
            <caption>Illustrative First Owner calculations using 410-point items</caption>
            <thead><tr><th scope="col">Items</th><th scope="col">Base subtotal</th><th scope="col">First Owner bonus</th><th scope="col">Combined score</th></tr></thead>
            <tbody>
              <tr><th scope="row">4</th><td>1,640</td><td>0</td><td>1,640</td></tr>
              <tr><th scope="row">5</th><td>2,050</td><td>3,075</td><td>5,125</td></tr>
              <tr><th scope="row">10</th><td>4,100</td><td>12,300</td><td>16,400</td></tr>
              <tr><th scope="row">20</th><td>8,200</td><td>41,000</td><td>49,200</td></tr>
            </tbody>
          </table>
        </div>
        <p>These are subtotal examples, not ready-to-grade lineups. You must satisfy the set&apos;s eligibility rules and fill every required slot before grading it. A special 83-rated version can have a different Item Score, so use the value shown in your game.</p>

        <h2>Buying a card does not make it First Owner</h2>
        <p>First Owner describes how you obtained the item. A Transfer Market purchase can fill a slot or improve another tag, but it does not acquire the First Owner flag simply because you are using the item for the first time in Gallery.</p>
        <p>Keep the First Owner items already available to you in mind when comparing upgrades in the <Link href="/">Gallery route planner</Link>. Enter a proposed set score that reflects the ownership status you can actually achieve.</p>

        <h2>If the displayed score is lower than expected</h2>
        <ul>
          <li>Confirm the tag is available for this set and enough items qualify for the chosen tier.</li>
          <li>Check the matching subtotal rather than the combined score of all items.</li>
          <li>Use the original version for an Evolution and exclude loan items.</li>
          <li>Keep each exact item version to one appearance within the same set.</li>
          <li>Round each tag bonus down separately. The score checker adds the ten largest entered tag bonuses to the base score.</li>
        </ul>
        <p>Once the projected score looks sensible, the <Link href="/gallery-levels/">level and grade guide</Link> helps you choose the progress target it should support. For the underlying collection rules, see the <Link href="/gallery-guide/">Gallery collection guide</Link>.</p>
      </div>
    </PageShell>
  );
}
