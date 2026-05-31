import Moviedetails from "../../../../components/routes/Moviedetails";

export default function MovieDetailsPage({
  params,
}: {
  params: { media_type: string; id: string };
}) {
  return <Moviedetails key={`${params.media_type}-${params.id}`} />;
}
