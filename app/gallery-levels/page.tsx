import Link from "@/components/SiteLink";
import PageShell from "@/components/PageShell";
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
        <img src="/levels-flow.svg" width={900} height={240} alt="Gallery sets produce score and grade progress; grade rewards can award tokens, and overall level progress has separate milestone rewards." />

        <h2>Which target are you trying to reach?</h2>
        <div className="table-scroll" tabIndex={0} role="region" aria-label="Scrollable Gallery reference table">
          <table className="data-table">
            <caption>Three Gallery progress tracks</caption>
            <thead><tr><th scope="col">Track</th><th scope="col">What it measures</th><th scope="col">What to enter</th></tr></thead>
            <tbody>
              <tr><th scope="row">Gallery level</th><td>Overall progress from completing and improving sets</td><td>Your current overall score and the target displayed in your game</td></tr>
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
            <tbody>{milestones.map(([level, reward]) => <tr key={level}><th scope="row">Level {level}</th><td>{reward}</td></tr>)}</tbody>
          </table>
        </div>
        <p>The reward overview&apos;s approximate season schedule describes expected progression. It is not a point target to paste into a calculator or a guarantee of when you can obtain an item.</p>

        <h2>How many points do you need for Level 10?</h2>
        <p>Use the target shown beside your Gallery progress in the game. The published milestone reward table does not supply a score threshold for Level 10 or a complete threshold list for every level.</p>
        <div className="notice">The 3,000,000 figure is a community reference for Level 10. Replace it with the target displayed in your game; do not derive other level targets by dividing or multiplying it.</div>
        <p>The <Link href="/">Gallery route planner</Link> accepts your own target. That makes it useful for any level without assuming that level thresholds follow a straight line.</p>

        <h2>Work out the gap before choosing sets</h2>
        <div className="example">
          <h3>Example: 300,000 more points</h3>
          <p>Your displayed current score is 2,700,000 and your chosen target is 3,000,000. The gap is 300,000. A set that moves from an already counted 100,000 to a planned 250,000 adds an estimated 150,000 toward that gap.</p>
          <p>You still need another 150,000 from your entered upgrades. Re-enter your current totals after grading sets so the next plan begins from the progress actually displayed in your game.</p>
        </div>
        <p>Count only the positive improvement for a set that is already part of your starting total. Enter one proposed final result for each alternative upgrade; buying several alternatives for the same set should not count as several new sets.</p>

        <h2>When tokens are the real target</h2>
        <p>The planner compares cumulative tokens earned, rather than the spendable balance left after purchases. If you have spent tokens, add that amount to both your current balance and your desired balance before entering the current and target totals.</p>
        <div className="example">
          <h3>Example: saving for a 400-token reward</h3>
          <p>You have 300 tokens left and have already spent 200. Enter 500 as current tokens earned and 600 as the target: 300 + 200 = 500, and 400 + 200 = 600. You need 100 more tokens.</p>
          <p>If one set has already earned 20 tokens and its proposed grade would bring its cumulative rewards to 50, enter current 20 and planned 50. Its new contribution is 30 tokens.</p>
        </div>
        <p>A route with the biggest score gain is not automatically the route with the most useful token gain. Compare the new tokens from your proposed grades with the gap to your cumulative target.</p>
        <p>Before using a planned set result, check its <Link href="/gallery-score-calculator/">Item Scores and tag bonuses</Link>. If First Owner is doing most of the work, the <Link href="/first-owner-bonus/">First Owner bonus guide</Link> explains why market purchases do not replace First Owner items.</p>
        <p>See <a href="https://www.ea.com/games/ea-sports-fc/fc-27/news/pitch-notes-fc27-launch-update">EA&apos;s FC 27 launch update</a> for the Gallery milestone overview.</p>
      </div>
    </PageShell>
  );
}
