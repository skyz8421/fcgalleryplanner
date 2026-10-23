import Link from "@/components/SiteLink";
import PageShell from "@/components/PageShell";
import LevelGapCalculator from "@/components/LevelGapCalculator";
import TokenReserveCalculator from "@/components/TokenReserveCalculator";
import { galleryLevelSource, reportedLevelPoints } from "@/lib/gallery-levels";
import { pageMetadata } from "@/lib/site";

const description = "Separate FC 27 Gallery levels, set grades and tokens, view milestone rewards, and calculate the gap to your own next-level target.";
export const metadata = pageMetadata("FC 27 Gallery levels and rewards", description, "/gallery-levels/");

const milestones = [
  ["5", "Holographic Squad Foundations Player"],
  ["10", "Holographic Base Hero Pick"],
  ["15", "Holographic Base ICON Pick"],
  ["20", "88+ Holographic Base Hero Pick"],
  ["25", "92+ Holographic Base Hero Pick"],
];

export default function GalleryLevelsPage() {
  return (
    <PageShell title="Gallery levels, grades and rewards" description={description} path="/gallery-levels/">
      <div className="prose">
        <p>There are three numbers to keep apart: your overall Gallery progress, the grade of an individual set, and your Gallery token balance. Improving a set can help more than one of them, but they are not interchangeable.</p>
        <figure style={{ margin: "1.5rem 0" }}>
          <a href="/levels-flow.svg" target="_blank" rel="noopener" aria-label="View the Gallery progress diagram at full size (opens in a new tab)">
            <img src="/levels-flow.svg" width={900} height={240} alt="Gallery sets produce score and grade progress; grade rewards can award tokens, and overall level progress has separate milestone rewards." />
          </a>
          <figcaption><a href="/levels-flow.svg" target="_blank" rel="noopener">View diagram at full size (new tab)</a></figcaption>
        </figure>

        <h2>Which target are you trying to reach?</h2>
        <div className="table-scroll" tabIndex={0} role="region" aria-label="Scrollable Gallery reference table">
          <table className="data-table">
            <caption>Three Gallery progress tracks</caption>
            <thead><tr><th scope="col">Track</th><th scope="col">What it measures</th><th scope="col">What to enter</th></tr></thead>
            <tbody>
              <tr><th scope="row">Gallery level</th><td>Overall progress from completing and improving sets</td><td>Your current overall score and a reported or chosen points target</td></tr>
              <tr><th scope="row">Set grade</th><td>A single set&apos;s D, C, B, A or S result</td><td>That set&apos;s present score and proposed improved score</td></tr>
              <tr><th scope="row">Gallery tokens</th><td>Reward currency earned through set grades</td><td>Total tokens earned so far and a target on the same cumulative basis; each set&apos;s current and planned grade totals</td></tr>
            </tbody>
          </table>
        </div>
        <p>A set that reaches a higher grade directly can also claim its lower grade rewards. In the planner, enter the cumulative tokens already earned from that set as its current tokens, and the cumulative total obtainable at the proposed grade as its planned tokens. The planner subtracts the current value to find the new tokens; do not enter only the extra reward as the planned total.</p>

        <h2>Published level milestone rewards</h2>
        <p>These are the level milestones in EA&apos;s Gallery reward overview. Check the game for the full reward details and your claim status.</p>
        <div className="table-scroll" tabIndex={0} role="region" aria-label="Scrollable Gallery reference table">
          <table className="data-table">
            <caption>Gallery milestone player rewards</caption>
            <thead><tr><th scope="col">Gallery level</th><th scope="col">Milestone reward</th></tr></thead>
            <tbody>{milestones.map(([level, reward]) => <tr key={level}><th scope="row">Level {level}</th><td>{level === "15" || level === "10" ? <Link href={`#level-${level}`} aria-label={`${reward}: plan for Level ${level}`}>{reward}</Link> : reward}</td></tr>)}</tbody>
          </table>
        </div>
        <p>The reward overview&apos;s approximate season schedule describes expected progression. It is not a point target to paste into a calculator or a guarantee of when you can obtain an item.</p>

        <section id="reported-points" tabIndex={-1} aria-label="Reported Gallery level point references">
          <h2>Reported points for Gallery levels</h2>
          <p><a href={galleryLevelSource}>FUT.GG&apos;s in-game report</a> lists these thresholds. They are third-party observations, not an official EA table. If your game shows points remaining instead of a target, add them to your current score.</p>
          <div className="table-scroll" tabIndex={0} role="region" aria-label="Scrollable reported points table">
            <table className="data-table"><caption>Planning references from FUT.GG</caption><thead><tr><th scope="col">Level</th><th scope="col">Reported points</th></tr></thead><tbody>
              {Object.entries(reportedLevelPoints).map(([level, points]) => <tr key={level}><th scope="row">{level}</th><td>{points.toLocaleString("en-US")}</td></tr>)}
              <tr><th scope="row">15, 20, 25</th><td>Unconfirmed — no preset</td></tr>
            </tbody></table>
          </div>
          <p>For example, 7,131,978 current points plus 3,868,022 remaining gives an 11,000,000 target. This is arithmetic from the Level 12 screen in the linked report, not a formula for other levels.</p>
          <p><Link href="#points-gap">Try a reported target in the gap calculator</Link>. References are optional and editable; a calculated gap does not confirm your in-game level.</p>
        </section>

        <section id="level-10" tabIndex={-1} aria-label="Level 10 planning steps">
        <h2>How many points do you need for Level 10?</h2>
        <p>FUT.GG reports 3,000,000 points for Level 10. Its in-game observations are separate from EA’s official milestone reward overview, which does not list point thresholds.</p>
        <div className="notice">Use the 3,000,000 reference as a planning aid, then check your actual level after grading. Do not derive other level targets by dividing or multiplying it.</div>
        <p>The <Link href="/">Gallery route planner</Link> accepts your own target. That makes it useful for any level without assuming that level thresholds follow a straight line.</p>
        <p>For the Holographic Base Hero Pick milestone, <Link href="#points-gap">open the points gap calculator</Link> and choose Level 10. Enter your current points and choose the reported reference, or enter your own target, to see what remains.</p>
        </section>

        <section id="level-15" tabIndex={-1} aria-label="Level 15 planning steps">
          <h2>Planning for Gallery Level 15</h2>
          <p>Level 15 has a Holographic Base ICON Pick milestone. Your overall Gallery points determine level progress; a large token balance does not substitute for those points.</p>
          <ol className="compact-list"><li>Copy your current Gallery points. Choose a provisional Level 15 planning target only if you understand that its threshold is unconfirmed.</li><li>Look for sets you can improve with cards already collected. Count the increase over each set&apos;s current score.</li><li>Compare those gains with market upgrades you can buy within your trading balance. If a required card is unavailable, exclude it rather than planning around a purchase you cannot make.</li></ol>
          <p>Level 15 remains unconfirmed in the cited report. The calculator leaves its target blank; entering an estimate does not verify that it will unlock the reward. Recheck your actual level after grading sets.</p>
          <LevelGapCalculator />
        </section>

        <h2>Work out the gap before choosing sets</h2>
        <div className="example">
          <h3>Example: 300,000 more points</h3>
          <p>Your displayed current score is 2,700,000 and your chosen target is 3,000,000. The gap is 300,000. A set that moves from an already counted 100,000 to a planned 250,000 adds an estimated 150,000 toward that gap.</p>
          <p>You still need another 150,000 from your entered upgrades. Re-enter your current totals after grading sets so the next plan begins from the progress actually displayed in your game.</p>
        </div>
        <p>Count only the positive improvement for a set that is already part of your starting total. Enter one proposed final result for each alternative upgrade; buying several alternatives for the same set should not count as several new sets.</p>

        <h2>When tokens are the real target</h2>
        <p>The planner compares cumulative tokens earned, rather than the spendable balance left after purchases. If you have spent tokens, add that amount to both your current balance and your desired balance before entering the current and target totals. The route planner&apos;s balance helper does this conversion for you without changing your cards or upgrade options.</p>
        <div className="example">
          <h3>Example: saving for a 400-token reward</h3>
          <p>You have 300 tokens left and have already spent 200. Enter 500 as current tokens earned and 600 as the target: 300 + 200 = 500, and 400 + 200 = 600. You need 100 more tokens.</p>
          <p>If one set has already earned 20 tokens and its proposed grade would bring its cumulative rewards to 50, enter current 20 and planned 50. Its new contribution is 30 tokens.</p>
        </div>
        <p>A route with the biggest score gain is not automatically the route with the most useful token gain. Compare the new tokens from your proposed grades with the gap to your cumulative target.</p>
        <section id="token-reserve" tabIndex={-1} aria-label="Spend or save Gallery tokens">
          <h2>Spend Gallery tokens now or keep a reserve?</h2>
          <p><strong>Gallery Tokens carry over between Seasons.</strong> EA&apos;s developers say they do not expire or reset at a Season change, so you can keep a reserve instead of spending just because the Season ends.</p>
          <aside className="notice" aria-label="Gallery Store refresh plan"><strong>Store refresh and token balance are different.</strong><p>EA plans a Gallery Store refresh for Season 3, with no new Hall of FUT items in that first refresh. Check each offer&apos;s own requirements and timer; keeping tokens does not keep an individual offer available.</p></aside>
          <p>Use the calculator to compare a purchase with the balance you want left. For the added League and Club Sets, see <Link href="/gallery-guide/#season-2">what Season 2 changes in Gallery</Link>.</p>
          <TokenReserveCalculator />
          <p>For example, with 750 tokens, a 500-token purchase leaves 250. If you want 750 left for another reward, you need 500 more before buying. Keeping all 750 already meets that reserve. These are example amounts, not a current store listing.</p>
          <p>For earning and claiming set rewards, follow the <Link href="/gallery-guide/">Gallery collection steps</Link>. Check <a href="https://help.ea.com/en/articles/ea-sports-fc/gallery-hub/">EA&apos;s Gallery help</a> and the offer in your game before choosing a purchase.</p>
        </section>
        <p>Before using a planned set result, check its <Link href="/gallery-score-calculator/">Item Scores and tag bonuses</Link>. If First Owner is doing most of the work, the <Link href="/first-owner-bonus/">First Owner bonus guide</Link> explains why market purchases do not replace First Owner items.</p>
        <p>See <a href="https://www.ea.com/games/ea-sports-fc/fc-27/news/pitch-notes-fc27-launch-update">EA&apos;s FC 27 launch update</a> for the Gallery milestone overview.</p>
      </div>
    </PageShell>
  );
}
