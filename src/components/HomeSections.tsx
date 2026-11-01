const steps = [
  { n: "1", t: "Add a Book", d: "Share a book you own with the community." },
  { n: "2", t: "Borrow a Book", d: "Pick any available book and borrow it for 7 days." },
  { n: "3", t: "Return a Book", d: "Done reading? Return it from My Borrows." },
];
const cats = [
  { t: "Fiction", d: "Novels and stories" },
  { t: "Science", d: "Discover how things work" },
  { t: "History", d: "Learn from the past" },
  { t: "Kids", d: "Fun reads for young minds" },
];

export default function HomeSections() {
  return (
    <>
      <section className="bg-base-200 py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold">How Borrowing Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="card h-full bg-base-100 shadow-md">
                <div className="card-body items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-content">{s.n}</div>
                  <h3 className="card-title">{s.t}</h3>
                  <p className="text-base-content/70">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold">Top Categories</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cats.map((c) => (
            <div key={c.t} className="card h-full bg-base-100 shadow-md">
              <div className="card-body items-center text-center">
                <h3 className="card-title text-primary">{c.t}</h3>
                <p className="text-base-content/70">{c.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}