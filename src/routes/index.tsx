import { createFileRoute, Link } from "@tanstack/react-router";
import { dummyId, useZero, type Zero } from "../zero";
import { useQuery } from "@rocicorp/zero/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn, NoUndefinedState } from "@/lib/utils";
import { Copy, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { type Z } from "schema";

const vibes = ["modern", "cozy", "artisanal", "social", "studious"] as const;
type CafeVibe = Z["Cafe"]["vibe"];

type CafeSortBy = keyof Pick<
  Z["Cafe"],
  "lastVisited" | "city" | "rating" | "vibe"
>;

type CafeInsert = Omit<Z["Cafe"], "id" | "lastVisited" | "userId">;

type CafeWithDrinksWithBeans = Z["Cafe"] & {
  drinks: Z["Drink"][];
  beans: Z["Beans"][];
};

interface CafeCardProps {
  cafe: CafeWithDrinksWithBeans;
  className?: string;
  deleteCafe: (cafeId: string) => void;
}

function CafeCard(props: CafeCardProps) {
  return (
    <Card
      className={cn(
        "w-full group relative transition-all rounded-md duration-0 hover:shadow-lg hover:shadow-orange-700/20",
        props.className
      )}
    >
      <Link to={`/cafe/${props.cafe.id}`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>{props.cafe.name}</CardTitle>
            <span className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
              {props.cafe.vibe}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto size-8 text-destructive hover:text-destructive-foreground hover:bg-destructive py-0"
              onClick={(e) => {
                e.preventDefault();
                props.deleteCafe(props.cafe.id);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </Button>
          </div>
          <CardDescription className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {props.cafe.city}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={i < props.cafe.rating ? "hsl(var(--chart-3))" : "none"}
                  stroke="hsl(var(--chart-3))"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          </div>

          {props.cafe.drinks.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Notable drinks:</p>
              <div className="flex gap-1 flex-wrap">
                {props.cafe.drinks.slice(0, 3).map((drink) => (
                  <span
                    key={drink.id}
                    className="px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground"
                  >
                    {drink.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}

const parseCafeData = (
  data: CafeInsert
): { status: "success"; data: CafeInsert } | { status: "error" } => {
  const createRangeCheck = (low: number, high: number) => (value: number) =>
    value >= low && value <= high;

  const parseDefaults = (value: any) => {
    return value !== undefined;
  };

  const checkNameBounds = createRangeCheck(1, 128);
  const checkCityBounds = createRangeCheck(1, 64);
  const checkRatingBounds = createRangeCheck(1, 64);

  return Object.entries(data).every(([key, value]) => {
    if (!parseDefaults(value)) {
      return false;
    }

    switch (key) {
      case "name":
        return typeof value === "string" && checkNameBounds(value.length);
      case "city":
        return typeof value === "string" && checkCityBounds(value.length);
      case "vibe":
        return typeof value === "string" && vibes.includes(value as CafeVibe);
      case "rating":
        return typeof value === "number" && checkRatingBounds(value);
      default:
        return false;
    }
  })
    ? { status: "success", data: data as CafeInsert }
    : { status: "error" };
};

interface NewCafeDialogProps {
  children: React.ReactNode;
  onSubmit: (data: CafeInsert) => void;
}

export function NewCafeDialog(props: NewCafeDialogProps) {
  const [dialogState, setDialogState] = useState<"open" | "closed">("closed");
  const open = () => setDialogState("open");
  const close = () => setDialogState("closed");

  const [name, setName] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [vibe, setVibe] = useState<string>("");
  const [rating, setRating] = useState(0);

  const reset = () => {
    setName("");
    setCity("");
    setVibe("");
    setRating(0);
  };

  return (
    <Dialog
      open={dialogState === "open"}
      onOpenChange={() =>
        setDialogState((prev) => (prev === "open" ? "closed" : "open"))
      }
    >
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Cafe</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const parsed = parseCafeData({
              name,
              city,
              vibe: vibe as CafeVibe,
              rating,
            });

            if (parsed.status !== "success") return;

            props.onSubmit(parsed.data);
            reset();
            close();
          }}
        >
          <div className="flex flex-col items-start w-full gap-2 lowercase [&>]:w-full [&>label]:mt-2">
            <Label htmlFor="cafe-title">Cafe Name</Label>
            <Input
              onChange={(e) => setName(e.currentTarget.value)}
              value={name}
              id="cafe-title"
              placeholder="starbucks..."
            />
            <Label htmlFor="cafe-city">city</Label>
            <Input
              onChange={(e) => setCity(e.currentTarget.value)}
              value={city}
              id="cafe-city"
              placeholder="seattle, wa"
            />
            <Select onValueChange={(e) => setVibe(e)} value={vibe}>
              <Label htmlFor="cafe-vibe">vibe</Label>
              <SelectTrigger id="cafe-vibe">
                <SelectValue placeholder="choose a vibe" />
              </SelectTrigger>
              <SelectContent id="cafe-vibe">
                <SelectGroup>
                  {vibes.map((vibe) => (
                    <SelectItem key={vibe} value={vibe} className="lowercase">
                      {vibe}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label htmlFor="cafe-rating">rating</Label>
            <div className="flex gap-2 items-center">
              <RadioGroup className="flex gap-4 py-0.5">
                {[1, 2, 3, 4, 5].map((r) => (
                  <div key={r} className="flex flex-col items-center gap-3">
                    <RadioGroupItem
                      value={rating >= r ? "true" : "false"}
                      id={`option-${r}`}
                      hidden
                    />
                    <button
                      type="button"
                      onClick={() => setRating(r)}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill={rating >= r ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                    <Label htmlFor="option-one">{r}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter className="sm:justify-between [&>*]:lowercase [&>*]:w-full mt-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button type="submit" variant="default">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const useQueries = (z: Zero, sortBy: CafeSortBy) => {
  const me = useQuery(z.query.user.where("id", "=", dummyId).one());

  const cafes = useQuery(
    z.query.cafe
      .where("userId", "=", dummyId)
      .orderBy(sortBy, "asc")
      .related("drinks")
      .related("beans")
  );

  return {
    me: {
      data: me[0],
      status: me[1],
    },
    cafes: {
      data: cafes[0],
      status: cafes[1],
    },
  };
};

const useCafeMutations = (z: Zero) => {
  function createCafe(cafe: CafeInsert) {
    z.mutate.cafe.insert({
      id: `${crypto.randomUUID()}`,
      userId: dummyId,
      lastVisited: Date.now(),
      ...cafe,
    });
  }

  function deleteCafe(cafeId: string) {
    z.mutate.cafe.delete({ id: cafeId });
  }
  return { createCafe, deleteCafe };
};

interface SortBySelectProps {
  state: NoUndefinedState<ReturnType<typeof useState<CafeSortBy>>>;
  sortOptions: CafeSortBy[];
}

function SortBySelect(props: SortBySelectProps) {
  const normalizedSortOptions = props.sortOptions.map((o) => ({
    display: o === "lastVisited" ? "last visited" : o,
    value: o,
  }));
  const [state, setState] = props.state;

  return (
    <Select onValueChange={(e) => setState(e as CafeSortBy)} value={state}>
      <Label htmlFor="cafe-vibe">sort: </Label>
      <SelectTrigger id="cafe-vibe" className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent id="cafe-vibe">
        <SelectGroup>
          {normalizedSortOptions.map(({ value, display }) => (
            <SelectItem key={value} value={value} className="lowercase">
              {display}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export const Route = createFileRoute("/")({
  component: function () {
    const [sortBy, setSortBy] = useState<CafeSortBy>("lastVisited");
    const zero = useZero();
    const { me, cafes } = useQueries(zero, sortBy);
    const { createCafe, deleteCafe } = useCafeMutations(zero);

    if (!me || !cafes) {
      return null;
    }

    return (
      <>
        <h3 className="text-3xl font-serif italic h-9 text-zinc-200 mb-6">
          {!me?.data ? "  " : `hello ${me.data?.name}!`}
        </h3>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-end gap-4 w-full">
            <h2 className="text-2xl font-serif text-zinc-200 mr-auto">
              your cafes
            </h2>
            <div className="flex gap-2.5 items-center w-full sm:w-auto">
              <SortBySelect
                state={[sortBy, setSortBy]}
                sortOptions={["lastVisited", "rating", "vibe", "city"]}
              />
              <NewCafeDialog onSubmit={createCafe}>
                <Button
                  variant={"outline"}
                  className="h-full ml-auto sm:ml-0 shadow duration-0"
                >
                  <Plus /> Add Cafe
                </Button>
              </NewCafeDialog>
            </div>
          </div>
          <hr />

          {cafes.status.type === "unknown" || cafes.data?.length ? (
            <>
              <ul className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 py-4 w-full">
                {cafes?.data.map((cafe) => (
                  <CafeCard key={cafe.id} cafe={cafe} deleteCafe={deleteCafe} />
                ))}
              </ul>
            </>
          ) : (
            <p className="text-zinc-400 text-lg">
              No cafes discovered yet... Time to explore!
            </p>
          )}
        </div>
      </>
    );
  },
});

/* {cafes.status.type === "complete" && */
/* ))} */
