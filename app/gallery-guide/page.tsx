import Link from "@/components/SiteLink";
import PageShell from "@/components/PageShell";
import { pageMetadata } from "@/lib/site";

const description = "Understand FC 27 Gallery sets, keep your players, and plan useful upgrades without confusing points, grades and tokens.";
export const metadata = pageMetadata("FC 27 Gallery guide", description, "/gallery-guide/");

export default function GalleryGuidePage() {
  return (
    <PageShell title="How FC 27 Gallery works" description={description} path="/gallery-guide/">
      <div className="prose">
        <p>Gallery turns your eligible player collection into sets. Fill a set, improve its score and claim the rewards for its grade. Your overall Gallery level and your spendable Gallery tokens are separate progress tracks.</p>
        <img src="/gallery-process.svg" width={900} height={240} alt="Eligible collection items fill sets; set scores determine grades and contribute to Gallery progress, while grade rewards can award tokens." />

        <h2>Start with the collection you already have</h2>
        <ol>
          <li>Open a set and read its item requirements. Check every required slot before buying anything.</li>
          <li>Fill it with eligible items from your collection. Look for useful tag combinations as well as high individual Item Scores.</li>
          <li>Review the completed set&apos;s score and grade, then claim its available grade rewards.</li>
          <li>Compare another set or a better version of this set before spending coins on missing items.</li>
        </ol>
        <p>A Gallery set does not consume the player items you put into it. The same eligible item can appear in more than one set, so one purchase can support several planned upgrades. Eligible items you have sold can still count in your collection history.</p>
        <div className="notice"><strong>Keep Gallery separate from SBCs.</strong> Completing a Gallery set does not submit its players into a Squad Building Challenge. Check which game screen you are using before confirming an action.</div>

        <h2>Check the version, not just the player&apos;s name</h2>
        <p>Different versions of a player are different Gallery items. Loan items do not count. An Evolution uses its original item version for Gallery; upgrading it does not create another Gallery version or increase its Gallery score through the Evolution upgrades.</p>
        <p>Item Score depends on more than overall rating. Rarity and holographic status can affect it too. When planning with special items, copy the Item Score shown in your game instead of substituting a score from a normal card with the same rating.</p>

        <h2>Tags can change which collection is strongest</h2>
        <p>Tags reward specific groups inside a set. For example, a First Owner bonus applies to the Item Score subtotal of qualifying First Owner items. It does not multiply every item in the set. A large bonus percentage on a small subtotal can be worth less than a smaller percentage on valuable items.</p>
        <p>Use the <Link href="/gallery-score-calculator/">Gallery score checker</Link> to compare the base score and the bonuses you have identified. The <Link href="/first-owner-bonus/">First Owner worked examples</Link> show how the matching subtotal and item count change the result.</p>

        <h2>Plan an improvement rather than buying a whole new set</h2>
        <div className="example">
          <h3>A set you have already graded</h3>
          <p>Suppose your current overall score is 2,700,000. One set already contributes 100,000 to the progress you are using. Your proposed upgrade raises that set to 250,000. Its estimated new contribution is 150,000, not another 250,000.</p>
          <p>If a second planned set contributes another 150,000, the two upgrades project a total of 3,000,000 from that starting point. This is a worked planning target; copy your actual next-level target from the game.</p>
        </div>
        <p>Enter your starting totals and proposed upgrades in the <Link href="/">Gallery route planner</Link>. Reuse the same card ID when two upgrades need the exact same version. The planner then counts that purchase once when comparing your entered routes.</p>

        <h2>Coins at risk and coins needed are different</h2>
        <p>A buy-and-resell route needs enough coins to buy its most demanding next item. Its eventual coin loss depends on resale prices and market tax. A low estimated loss does not make a route affordable when you cannot fund the first purchase.</p>
        <p>Enter purchase and expected resale prices yourself. Treat a resale as a successful sale at that price, not a guaranteed immediate return. If you keep several purchases at once, you need more working capital than a route that sells each item before buying the next.</p>

        <h2>What should you aim for next?</h2>
        <p>Choose your target before comparing routes: another overall level, another set grade, or enough tokens for a specific reward. The planner&apos;s token totals are cumulative tokens earned. If you have spent tokens, add the amount spent to both your current balance and your desired balance. For each set, enter current and planned cumulative grade rewards; the planner calculates the extra tokens.</p>
        <p>The <Link href="/gallery-levels/">level and reward guide</Link> gives a token-entry example and lists the published milestone rewards.</p>
        <h2>When a card cannot be bought</h2>
        <p>Check the required card variant before relying on an upgrade. In the <Link href="/">route planner</Link>, mark an uncollected card <strong>Unavailable to buy</strong> to exclude every upgrade that needs it. Other routes remain available. A card already collected can still count, so it is not blocked by current market availability.</p>
        <p>For a higher milestone, use the <Link href="/gallery-levels/#level-15">Level 15 planning steps and points-gap calculator</Link>. When tokens are the target, use the planner&apos;s balance helper to add past spending to your current and desired balances.</p>
        <p>For collection eligibility and grade-claim rules, read <a href="https://help.ea.com/en/articles/ea-sports-fc/gallery-hub/">EA&apos;s Gallery help</a>.</p>
      </div>
    </PageShell>
  );
}
