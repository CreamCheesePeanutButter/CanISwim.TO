interface FacilityCardProps {
  facilityName: string | null;
}

interface SampleComment {
  id: number;
  username: string;
  date: string;
  comment: string;
}

const sampleComments: SampleComment[] = [
  {
    id: 1,
    username: "Alex M.",
    date: "Nov 20, 2026",
    comment:
      "The swimming area was clean and the water looked clear. Had a great experience!",
  },
  {
    id: 2,
    username: "Sarah K.",
    date: "Nov 18, 2026",
    comment:
      "Noticed some garbage near the shoreline. Hopefully the area gets cleaned up soon.",
  },
  {
    id: 3,
    username: "Jordan T.",
    date: "Nov 15, 2026",
    comment:
      "There were quite a few people swimming today. The beach was crowded.",
  },
];

export function FacilityCard({ facilityName }: FacilityCardProps) {
  if (!facilityName) {
    return (
      <div className=" flex-1 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center p-6 text-center text-gray-400">
        <p className="text-sm">Select a facility to view community comments.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900">Community Comments</h3>

        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          {sampleComments.length} Comments
        </span>
      </div>

      <p className="text-xs text-gray-500">
        Visitor feedback for {facilityName}
      </p>

      {sampleComments.map((comment) => (
        <div
          key={comment.id}
          className="bg-gray-50 border border-gray-100 rounded-xl p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
              {comment.username.charAt(0)}
            </div>

            <div>
              <p className="text-xs font-bold text-gray-800">
                {comment.username}
              </p>
              <p className="text-[10px] text-gray-400">{comment.date}</p>
            </div>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            {comment.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
