import React from 'react';

const Documentation = () => {
  const docs = [
    {
      category: 'Getting Started',
      items: [
        { title: 'Introduction', link: '#introduction' },
        { title: 'Quick Start Guide', link: '#quick-start' },
        { title: 'Installation', link: '#installation' },
      ]
    },
    {
      category: 'Core Concepts',
      items: [
        { title: 'Container Management', link: '#containers' },
        { title: 'Templates', link: '#templates' },
        { title: 'Deployment', link: '#deployment' },
      ]
    },
    {
      category: 'Advanced Topics',
      items: [
        { title: 'Security', link: '#security' },
        { title: 'Monitoring', link: '#monitoring' },
        { title: 'Scaling', link: '#scaling' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-white text-center">Documentation</h1>
        </div>
      </div>

      {/* Documentation Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <div className="sticky top-8">
                <nav className="space-y-6">
                  {docs.map((section, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900 mb-2">{section.category}</h3>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <a href={item.link} className="text-gray-600 hover:text-black">
                              {item.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-8">
                <section id="introduction" className="mb-12">
                  <h2 className="text-3xl font-bold mb-6">Introduction</h2>
                  <p className="text-gray-600 mb-4">
                    Welcome to the Terminus documentation. This guide will help you understand and implement
                    our container management solutions effectively.
                  </p>
                  <p className="text-gray-600">
                    Terminus provides a robust platform for managing and deploying containers with ease.
                  </p>
                </section>

                <section id="quick-start" className="mb-12">
                  <h2 className="text-3xl font-bold mb-6">Quick Start Guide</h2>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <code className="text-sm">
                      npm install terminus-client
                    </code>
                  </div>
                  <p className="text-gray-600">
                    Get started quickly by installing our client library and following these steps...
                  </p>
                </section>

                <section id="installation" className="mb-12">
                  <h2 className="text-3xl font-bold mb-6">Installation</h2>
                  <ol className="list-decimal list-inside space-y-4 text-gray-600">
                    <li>Download the Terminus CLI</li>
                    <li>Configure your environment</li>
                    <li>Set up your first container</li>
                  </ol>
                </section>

                {/* Add more documentation sections as needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;