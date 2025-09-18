
import { Leaf, Shield, Lightbulb } from 'lucide-react';
const Choose = () => {
    const features = [
        {
            icon: Leaf,
            title: 'AI Plant Health Detection',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi voluptatibus enim eius nihil, eum et.',
            color: 'from-emerald-500 to-green-600',
            delay: 0.2
        },
        {
            icon: Shield,
            title: 'Smart Crop Protection',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi voluptatibus enim eius nihil, eum et.',
            color: 'from-blue-500 to-cyan-600',
            delay: 0.4
        },
        {
            icon: Lightbulb,
            title: 'Regional Expertise',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi voluptatibus enim eius nihil, eum et.',
            color: 'from-orange-500 to-amber-600',
            delay: 0.6
        }
    ];

    return (
        <section className="py-24 px-6 relative bg-[#F5FDEA]">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Why Choose AgriScan?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Advanced AI technology meets traditional farming wisdom to help you grow better crops.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {
                        features.map((features, index) => {
                            const Icon = features.icon;

                            return (
                                <div key={index}>
                                    <div className="p-8 text-center border-0 shadow-2xl bg-white hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 rounded-3xl group overflow-hidden relative">
                                        <div className="relative z-10">
                                            <div className={`w-20 h-20 bg-gradient-to-br ${features.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                                                <Icon size={36} className="text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4 text-gray-800">{features.title}</h3>
                                            <p className="text-gray-600 leading-relaxed text-lg">{features.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default Choose