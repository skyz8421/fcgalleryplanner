import Link from "@/components/SiteLink";
import PageShell from "@/components/PageShell";
import { pageMetadata } from "@/lib/site";

const description = "Read the references and calculation assumptions behind FCGallery's manually entered route planner and Gallery score checker.";
export const metadata = pageMetadata("Sources and calculation assumptions", description, "/sources/");

export default function SourcesPage() {
  return (
    <PageShell title="Sources and calculation assumptions" description={description} path="/sources/">
      <div className="prose"><p><q data-source-id="ea-gallery">Yes, you can use the same Player Item in multiple Gallery Sets.</q> — <a href="https://help.ea.com/en/articles/ea-sports-fc/gallery-hub/">EA Help</a></p>
        <p>FCGallery is an independent planning tool. It uses scores and prices you enter; it does not connect to your EA account or receive a live player-price feed. The distinction between published game rules, public-tool conventions and planning assumptions matters when comparing a calculation with your game.</p>
        <img src="/gallery-process.svg" width={900} height={240} alt="Diagram of the collection, set scoring, grade and overall Gallery progress used to organize the planning tools." />

        <h2>Published EA references</h2>
        <ul>
          <li><a href="https://help.ea.com/en/articles/ea-sports-fc/gallery-hub/">EA Gallery help</a>: set eligibility, keeping items when filling sets, reusing items across sets, loan exclusions, original Evolution versions and claiming grade rewards.</li>
          <li><a href="https://www.ea.com/games/ea-sports-fc/fc-27/news/pitch-notes-fc27-launch-update">FC 27 launch update</a>: the overall-rating Item Score table and Gallery level milestone rewards. Rarity and holographic status can also affect an item&apos;s score.</li>
          <li><a href="https://www.ea.com/games/ea-sports-fc/fc-27/news/pitch-notes-fc27-fut-deep-dive">FC 27 Ultimate Team deep dive</a>: Gallery sets, overall progression and token rewards.</li>
          <li><a href="https://help.ea.com/en/articles/ea-sports-fc/community-api/">EA Community API information</a>: account integration through approved community partners. FCGallery has no approved account integration.</li>
        </ul>

        <h2>Public-tool scoring references</h2>
        <p><a href="https://www.fut.gg/fut-gallery/tags/">FUT.GG&apos;s Gallery tag catalogue</a> lists the tag tiers used as references for the score checker, including First Owner bonuses of 150%, 300% and 500% at 5, 10 and 20 matching items. The bonus applies to the matching Item Score subtotal.</p>
        <p><a href="https://fcdata.io/fut-gallery/">FCData&apos;s Gallery tool</a> describes scoring each eligible tag from its matching subtotal, rounding each tag bonus down and adding the ten largest bonuses. These are public-tool declarations; they do not establish that every possible in-game edge case has been tested here.</p>
        <p>The checker asks you to identify the matching subtotal. It does not infer eligibility from player names or resolve ambiguous combinations of duplicates, leagues, nations and clubs automatically. Read the <Link href="/first-owner-bonus/">First Owner examples</Link> for a concrete calculation.</p>

        <h2>What the route planner estimates</h2>
        <p>The <Link href="/">Gallery route planner</Link> anchors its calculation to the current overall total you enter. For each chosen set upgrade, it adds the positive difference between the entered planned score and the score already counted in your starting progress. It selects at most one upgrade for a set and purchases each shared exact card ID once.</p>
        <p>This is a planning model for your supplied upgrades. EA&apos;s published explanation says that completing and improving sets contributes to overall progress; it does not publish a complete historical-score formula in the references above. Check the updated total in your game after grading a set.</p>
        <p>Token inputs use cumulative tokens earned. Current and target totals must share that basis, even if some tokens have been spent. For a set upgrade, current tokens are the cumulative tokens already earned from its grade rewards, and planned tokens are the cumulative total obtainable at the proposed grade. The difference is its new token contribution.</p>
        <p>Route comparisons consider the alternatives you supply. They do not scan the entire Transfer Market, prove that no cheaper item exists or guarantee that an entered resale price will be available.</p>

        <h2>Market tax and working capital</h2>
        <p>The default 5% resale-tax estimate follows the public Gallery tools. You can change it. Estimated proceeds are the resale price multiplied by one minus the entered tax rate. The planner does not reproduce any unverified whole-coin rounding rule from actual transactions.</p>
        <p>Working capital assumes that you buy an item, register it and successfully resell it before buying the next one. Profit-making trades can supply proceeds for later purchases; loss-making trades reduce your remaining balance. Holding several purchases at once or waiting for an unsold listing changes the amount you need.</p>
        <p>Two market transactions means one purchase and one sale. A set to grade is shown separately. These counts are not a time estimate or a count of every interface click.</p>

        <h2>Level targets and example data</h2>
        <p>The official milestone reward table supplies rewards at levels 5, 10, 15, 20 and 25, but does not give a full list of point thresholds. The 3,000,000 Level 10 reference comes from a <a href="https://www.reddit.com/r/fut/comments/1wnnwio/gallery_level_10_hero_pick_rush/">community report</a>. It remains an editable reference, not an official threshold.</p>
        <p>Use the target displayed in your game. The <Link href="/gallery-levels/">level and reward guide</Link> distinguishes overall targets from set grades and token balances.</p>
        <p>Worked examples and any example plans are illustrative inputs. Their arithmetic can be reproduced, but their prices are not live quotes and their hypothetical item groups are not recommendations to buy a particular real player.</p>
      </div>
    </PageShell>
  );
}
