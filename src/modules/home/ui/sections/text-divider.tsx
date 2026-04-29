const TextDivider = () => {
  return (
    <section className="flex w-full flex-col items-center bg-black px-6 py-24 text-center">
      <div className="max-w-4xl">
        <h3 className="text-2xl italic leading-relaxed text-white md:text-4xl font-serif">
          <span className="font-bold not-italic text-yellow-500">IFFA</span>, is where creative ambition is
          recognised, cinematic excellence is honoured, and stories transcend borders to inspire the
          world.
        </h3>

        <div className="mx-auto mt-12 h-[1px] w-1/3 bg-gradient-to-r from-transparent via-yellow-600 to-transparent" />
      </div>
    </section>
  );
};

export { TextDivider };
export default TextDivider;