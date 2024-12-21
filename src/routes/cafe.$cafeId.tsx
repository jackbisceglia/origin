import { createFileRoute, Link } from "@tanstack/react-router";
import { useZero } from "../zero";
import { useQuery } from "@rocicorp/zero/react";
import { Z } from "schema";

type BeansCardProps = {
  beans: Z["Beans"];
};

function BeansCard(props: BeansCardProps) {
  return (
    <Link
      to={`/cafe/${props.beans.id}`}
      key={props.beans.id}
      className="bg-zinc-900/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-zinc-800 backdrop-blur-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-serif text-zinc-200">
          {props.beans.name}
        </h3>
        <button
          onClick={() => {}} // TODO:
          className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center text-zinc-300">
          <span className="mr-2">☕</span>
          <span className="font-medium">{props.beans.rating}</span>
        </div>
        <div className="flex items-center text-zinc-300">
          <span className="mr-2">⭐️</span>
          <span className="font-medium">{props.beans.rating}/5</span>
        </div>
      </div>
    </Link>
  );
}

type DrinkCardProps = {
  drink: Z["Drink"];
};

function DrinkCard(props: DrinkCardProps) {
  return (
    <Link
      to={`/cafe/${props.drink.id}`}
      key={props.drink.id}
      className="bg-zinc-900/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-zinc-800 backdrop-blur-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-serif text-zinc-200">
          {props.drink.name}
        </h3>
        <button
          onClick={() => {}} // TODO:
          className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center text-zinc-300">
          <span className="mr-2">☕</span>
          <span className="font-medium">{props.drink.type}</span>
        </div>
        <div className="flex items-center text-zinc-300">
          <span className="mr-2">⭐️</span>
          <span className="font-medium">{props.drink.rating}/5</span>
        </div>
      </div>
    </Link>
  );
}

export const Route = createFileRoute("/cafe/$cafeId")({
  component: function () {
    const params = Route.useParams();
    const zero = useZero();

    const [cafe] = useQuery(
      zero.query.cafe
        .where("id", "=", params.cafeId)
        .one()
        .related("drinks")
        .related("beans")
    );

    return (
      <>
        <div className="space-y-1 pb-6">
          <h3 className="text-3xl h-9 font-serif italic text-zinc-200">
            {!cafe ? ` ` : `${cafe.name}!`}
          </h3>
          <p>📍 {!cafe ? "  " : `${cafe.city}`} </p>
        </div>

        <div className="flex flex-col gap-3 py-3">
          <div className="flex items-center justify-between gap-4 w-full">
            <h2 className="text-2xl font-serif text-zinc-200">drinks</h2>
            <button
              onPointerDown={() => {}} // TODO:
              className="px-4 py-2 bg-orange-700/60 hover:bg-orange-700/80 text-sm text-zinc-200 rounded-lg transition-colors duration-200"
            >
              New Drink
            </button>
          </div>
          <hr />

          {cafe?.drinks.length ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {cafe?.drinks?.map((drink) => (
                <DrinkCard key={cafe.id} drink={drink} />
              ))}
            </ul>
          ) : (
            <p className="text-zinc-400 text-lg">No drinks yet...</p>
          )}
        </div>

        <div className="flex flex-col gap-3 py-3">
          <div className="flex items-center justify-between gap-4 w-full">
            <h2 className="text-2xl font-serif text-zinc-200">beans</h2>
            <button
              onPointerDown={() => {}} // TODO:
              className="px-4 py-2 bg-orange-700/60 hover:bg-orange-700/80 text-sm text-zinc-200 rounded-lg transition-colors duration-200"
            >
              New Beans
            </button>
          </div>
          <hr />

          {cafe?.beans.length ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {cafe?.beans?.map((beans) => (
                <BeansCard key={cafe.id} beans={beans} />
              ))}
            </ul>
          ) : (
            <p className="text-zinc-400 text-lg">No beans yet...</p>
          )}
        </div>
      </>
    );
  },
});
