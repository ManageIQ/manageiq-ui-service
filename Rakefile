task :test => "test:all"

desc "Run all tests"
namespace :test do
  task :all => %i[yarn node]

  desc "Run yarn tests"
  task :yarn do
    system("yarn run test")
    exit $?.exitstatus
  end

  desc "Run node tests"
  task :node do
    system("node language/travis.js")
    exit $?.exitstatus
  end
end

task :default => :test
