import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { format } from "date-fns";
import { Tooltip as ReactTooltip } from "react-tooltip";

const SubmissionMap = ({
  startDate,
  endDate,
  activityData,
  tooltipId = "heatmap-tooltip"
}) => (
  <div>
    <h3 className="text-xl font-semibold mb-2 text-white">Submission Map</h3>
    <div className="bg-gray-900 rounded-md p-3 overflow-auto">
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={activityData}
        classForValue={value => {
          if (!value) return "color-empty";
          if (value.count >= 5) return "color-scale-4";
          if (value.count >= 3) return "color-scale-3";
          if (value.count >= 2) return "color-scale-2";
          if (value.count >= 1) return "color-scale-1";
          return "color-empty";
        }}
        tooltipDataAttrs={value => {
          if (!value || !value.date) {
            return {
              "data-tooltip-id": tooltipId,
              "data-tooltip-content": "No submissions",
            };
          }
          return {
            "data-tooltip-id": tooltipId,
            "data-tooltip-content": `${format(new Date(value.date), "MMM d, yyyy")}: ${value.count} submission(s)`,
          };
        }}
        showWeekdayLabels
      />
      <ReactTooltip id={tooltipId} effect="solid" place="top" />
      <div className="flex gap-2 mt-2 text-xs text-gray-400 select-none">
        <span>Less</span>
        <div className="w-4 h-4 bg-[#22c55e33] rounded" />
        <div className="w-4 h-4 bg-[#22c55e66] rounded" />
        <div className="w-4 h-4 bg-[#22c55e99] rounded" />
        <div className="w-4 h-4 bg-[#22c55e] rounded" />
        <span>More</span>
      </div>
      <style>{`
        .color-empty { fill: #1f2937; }
        .color-scale-1 { fill: #22c55e33; }
        .color-scale-2 { fill: #22c55e66; }
        .color-scale-3 { fill: #22c55e99; }
        .color-scale-4 { fill: #22c55e; }
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg,#444 45%,#0a451a, #411333);
          border-radius: 8px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  </div>
);

export default SubmissionMap;
